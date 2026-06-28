import { createServerFn } from "@tanstack/start";
import { eq, and, count, desc } from "drizzle-orm";
import { db } from "~/lib/db";
import { competitors, alerts, users } from "~/lib/schema";
import { authMiddleware } from "~/middleware/auth";
import { PLAN_LIMITS } from "~/lib/stripe";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    const plan = (context.session.user as any).plan as "free" | "pro" | "agency";

    const [competitorList, recentAlerts, [unseenCount]] = await Promise.all([
      db.query.competitors.findMany({
        where: eq(competitors.userId, userId),
        columns: { id: true, name: true, url: true, status: true, lastCheckedAt: true },
        orderBy: (c, { desc }) => [desc(c.createdAt)],
      }),
      db.query.alerts.findMany({
        where: eq(alerts.userId, userId),
        orderBy: [desc(alerts.createdAt)],
        limit: 10,
      }),
      db
        .select({ value: count() })
        .from(alerts)
        .where(and(eq(alerts.userId, userId), eq(alerts.seen, false))),
    ]);

    return {
      competitors: competitorList,
      recentAlerts,
      stats: {
        totalCompetitors: competitorList.length,
        unseenAlerts: unseenCount?.value ?? 0,
        planLimit: PLAN_LIMITS[plan].competitors,
        plan,
      },
    };
  });
