import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { eq, and, count } from "drizzle-orm";
import { db } from "~/lib/db";
import { competitors, users } from "~/lib/schema";
import { authMiddleware } from "~/middleware/auth";
import { PLAN_LIMITS } from "~/lib/stripe";
import { checkCompetitorTask } from "../../trigger/check-competitor";

// ─── List ────────────────────────────────────────────────────────────────────

export const listCompetitors = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    return db.query.competitors.findMany({
      where: eq(competitors.userId, userId),
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
  });

// ─── Add ────────────────────────────────────────────────────────────────────

export const addCompetitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().min(1).max(100),
      url: z.string().url(),
      description: z.string().max(500).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const plan = context.session.user.plan as "free" | "pro" | "agency";

    // Enforce plan limit
    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(competitors)
      .where(eq(competitors.userId, userId));

    const limit = PLAN_LIMITS[plan].competitors;
    if (currentCount >= limit) {
      throw new Error(
        `PLAN_LIMIT: You've reached the ${limit} competitor limit on the ${plan} plan. Upgrade to add more.`
      );
    }

    const [competitor] = await db
      .insert(competitors)
      .values({ userId, name: data.name, url: data.url, description: data.description })
      .returning();

    // Trigger immediate first check
    if (competitor) {
      await checkCompetitorTask.trigger({ competitorId: competitor.id });
    }

    return competitor;
  });

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteCompetitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    await db
      .delete(competitors)
      .where(and(eq(competitors.id, data.id), eq(competitors.userId, userId)));
    return { success: true };
  });

// ─── Pause / Resume ──────────────────────────────────────────────────────────

export const toggleCompetitorStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), status: z.enum(["active", "paused"]) }))
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const [updated] = await db
      .update(competitors)
      .set({ status: data.status })
      .where(and(eq(competitors.id, data.id), eq(competitors.userId, userId)))
      .returning();
    return updated;
  });
