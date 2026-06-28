import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { db } from "~/lib/db";
import { users } from "~/lib/schema";
import { eq } from "drizzle-orm";
import {
  stripe,
  STRIPE_PLANS,
  getOrCreateStripeCustomer,
  createCheckoutSession,
  createBillingPortal,
} from "~/lib/stripe";
import { authMiddleware } from "~/middleware/auth";

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ plan: z.enum(["pro", "agency"]) }))
  .handler(async ({ data, context }) => {
    const { user } = context.session;
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      user.name
    );
    const priceId = STRIPE_PLANS[data.plan].priceId;
    const session = await createCheckoutSession(customerId, priceId, user.id);
    return { url: session.url };
  });

export const openBillingPortal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { user } = context.session;
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { stripeCustomerId: true },
    });
    if (!dbUser?.stripeCustomerId) throw new Error("No Stripe customer found");
    const portal = await createBillingPortal(dbUser.stripeCustomerId);
    return { url: portal.url };
  });
