import { createAPIFileRoute } from "@tanstack/start/api";
import { stripe } from "~/lib/stripe";
import { db } from "~/lib/db";
import { users } from "~/lib/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const APIRoute = createAPIFileRoute("/api/stripe/webhook")({
  POST: async ({ request }) => {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) return new Response("Missing signature", { status: 400 });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed", err);
      return new Response("Invalid signature", { status: 400 });
    }

    try {
      await handleStripeEvent(event);
    } catch (err) {
      console.error("Webhook handler error", err);
      return new Response("Handler error", { status: 500 });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const userId = session.subscription
        ? ((await stripe.subscriptions.retrieve(session.subscription as string)).metadata?.userId)
        : session.metadata?.userId;
      if (!userId) break;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = sub.items.data[0]?.price.id;
      const plan = priceId === process.env.STRIPE_AGENCY_PRICE_ID ? "agency" : "pro";
      await db.update(users).set({
        plan,
        stripeSubscriptionId: sub.id,
        stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
      }).where(eq(users.id, userId));
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      const priceId = sub.items.data[0]?.price.id;
      const plan = priceId === process.env.STRIPE_AGENCY_PRICE_ID
        ? "agency"
        : sub.status === "active" ? "pro" : "free";
      await db.update(users).set({
        plan,
        stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
      }).where(eq(users.id, userId));
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      await db.update(users).set({
        plan: "free",
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
      }).where(eq(users.id, userId));
      break;
    }
  }
}
