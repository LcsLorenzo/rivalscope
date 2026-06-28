import { createAPIFileRoute } from "@tanstack/start/api";
import Stripe               from "stripe";
import { eq }               from "drizzle-orm";
import { db }               from "~/lib/db";
import { userProfiles }     from "../../../../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const APIRoute = createAPIFileRoute("/api/stripe/webhook")({
  POST: async ({ request }) => {
    const sig  = request.headers.get("stripe-signature");
    const body = await request.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.userId;
        const plan    = session.metadata?.plan as "pro" | "agency" | undefined;
        if (userId && plan) {
          await db
            .update(userProfiles)
            .set({ plan, stripeSubId: session.subscription as string, updatedAt: new Date() })
            .where(eq(userProfiles.userId, userId));
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const meta = sub.metadata as { userId?: string; plan?: string };
        if (meta.userId) {
          await db
            .update(userProfiles)
            .set({ stripeSubId: sub.id, updatedAt: new Date() })
            .where(eq(userProfiles.userId, meta.userId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // Find user by stripeSubId and downgrade to free
        await db
          .update(userProfiles)
          .set({ plan: "free", stripeSubId: null, updatedAt: new Date() })
          .where(eq(userProfiles.stripeSubId, sub.id));
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});
