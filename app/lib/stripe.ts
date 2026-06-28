import Stripe from "stripe";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

// ─── Plan limits ──────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  free:   { competitors: 2,   checkInterval: 168 }, // weekly
  pro:    { competitors: 10,  checkInterval: 1   }, // hourly
  agency: { competitors: 999, checkInterval: 1   }, // hourly
} as const;

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: "Pro",
    price: 2900, // $29 in cents
  },
  agency: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    name: "Agency",
    price: 9900, // $99 in cents
  },
} as const;

// ─── Create/retrieve Stripe customer ─────────────────────────────────────────

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId));

  return customer.id;
}

// ─── Create checkout session ──────────────────────────────────────────────────

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId },
    },
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });
}

// ─── Create billing portal ────────────────────────────────────────────────────

export async function createBillingPortal(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });
}
