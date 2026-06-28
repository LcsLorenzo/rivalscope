import { createServerFn } from "@tanstack/react-start";
import { z }              from "zod";
import { eq }             from "drizzle-orm";
import Stripe            from "stripe";
import { db }             from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";
import { apiRateLimit }   from "~/middleware/rate-limit";
import { userProfiles }   from "../../drizzle/schema";
import type { Plan }      from "~/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const PRICE_IDS: Record<string, string> = {
  pro:    process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

// ─── Create checkout ──────────────────────────────────────────────────────────
export const createCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware, apiRateLimit])
  .validator(z.object({ plan: z.enum(["pro", "agency"]) }))
  .handler(async ({ data, context }) => {
    const appUrl = process.env.VITE_APP_URL ?? "http://localhost:3000";
    const priceId = PRICE_IDS[data.plan];
    if (!priceId) throw new Error("Invalid plan");

    // Get or create Stripe customer
    let [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, context.user.id))
      .limit(1);

    let customerId = profile?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: context.user.email,
        metadata: { userId: context.user.id },
      });
      customerId = customer.id;
      await db
        .update(userProfiles)
        .set({ stripeCustomerId: customerId })
        .where(eq(userProfiles.userId, context.user.id));
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 14 },
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url:  `${appUrl}/pricing`,
      metadata: { userId: context.user.id, plan: data.plan },
    });

    return { url: session.url! };
  });

// ─── Billing portal ───────────────────────────────────────────────────────────
export const openBillingPortal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const appUrl = process.env.VITE_APP_URL ?? "http://localhost:3000";

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, context.user.id))
      .limit(1);

    if (!profile?.stripeCustomerId) {
      throw new Error("No billing account found. Please upgrade first.");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer:   profile.stripeCustomerId,
      return_url: `${appUrl}/dashboard/settings`,
    });

    return { url: portalSession.url };
  });
