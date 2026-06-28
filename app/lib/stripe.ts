import Stripe from "stripe";
import { db } from "./db";
import { userProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLAN_LIMITS = {
  free:   { competitors: 2,   checkInterval: 168 },
  pro:    { competitors: 10,  checkInterval: 1   },
  agency: { competitors: 999, checkInterval: 1   },
} as const;

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: "Pro",
    price: 2900,
  },
  agency: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    name: "Agency",
    price: 9900,
  },
} as const;

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const [profile] = await db
    .select({ stripeCustomerId: userProfiles.stripeCustomerId })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  if (profile?.stripeCustomerId) return profile.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  await db
    .update(userProfiles)
    .set({ stripeCustomerId: customer.id })
    .where(eq(userProfiles.userId, userId));

  return customer.id;
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const appUrl = process.env.VITE_APP_URL ?? "http://localhost:3000";
  return stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId },
    },
    allow_promotion_codes: true,
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
  });
}

export async function createBillingPortal(customerId: string) {
  const appUrl = process.env.VITE_APP_URL ?? "http://localhost:3000";
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard/settings`,
  });
}