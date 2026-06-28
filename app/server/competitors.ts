import { createServerFn } from "@tanstack/react-start";
import { z }              from "zod";
import { eq, and, desc }  from "drizzle-orm";
import { db }             from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";
import { apiRateLimit }   from "~/middleware/rate-limit";
import { competitors, userProfiles } from "../../drizzle/schema";
import { canAddCompetitor, type Plan } from "~/lib/plans";

const addSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  url:  z.string().url("Must be a valid URL"),
  description: z.string().max(500).optional(),
});

// ─── List ─────────────────────────────────────────────────────────────────────
export const listCompetitors = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db
      .select()
      .from(competitors)
      .where(eq(competitors.userId, context.user.id))
      .orderBy(desc(competitors.createdAt));
  });

// ─── Add ──────────────────────────────────────────────────────────────────────
export const addCompetitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware, apiRateLimit])
  .validator(addSchema)
  .handler(async ({ data, context }) => {
    // Check plan limit
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, context.user.id))
      .limit(1);

    const plan = (profile?.plan ?? "free") as Plan;

    const existing = await db
      .select({ id: competitors.id })
      .from(competitors)
      .where(and(
        eq(competitors.userId, context.user.id),
        eq(competitors.active, true),
      ));

    if (!canAddCompetitor(plan, existing.length)) {
      throw new Error("PLAN_LIMIT: Upgrade your plan to add more competitors");
    }

    const [competitor] = await db
      .insert(competitors)
      .values({ userId: context.user.id, ...data })
      .returning();

    return competitor;
  });

// ─── Toggle active ────────────────────────────────────────────────────────────
export const toggleCompetitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), active: z.boolean() }))
  .handler(async ({ data, context }) => {
    const [updated] = await db
      .update(competitors)
      .set({ active: data.active, updatedAt: new Date() })
      .where(and(
        eq(competitors.id, data.id),
        eq(competitors.userId, context.user.id), // ownership check
      ))
      .returning();
    return updated;
  });

// ─── Delete ───────────────────────────────────────────────────────────────────
export const deleteCompetitor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    await db
      .delete(competitors)
      .where(and(
        eq(competitors.id, data.id),
        eq(competitors.userId, context.user.id), // ownership check
      ));
    return { success: true };
  });
