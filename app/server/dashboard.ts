import { createServerFn } from "@tanstack/react-start";
import { eq, count, and } from "drizzle-orm";
import { db }             from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";
import { competitors, alerts, userProfiles } from "../../drizzle/schema";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const uid = context.user.id;

    const [competitorCount, unreadCount, totalAlerts, profile] =
      await Promise.all([
        db.select({ c: count() }).from(competitors)
          .where(and(eq(competitors.userId, uid), eq(competitors.active, true)))
          .then((r) => r[0]?.c ?? 0),

        db.select({ c: count() }).from(alerts)
          .where(and(eq(alerts.userId, uid), eq(alerts.status, "unread")))
          .then((r) => r[0]?.c ?? 0),

        db.select({ c: count() }).from(alerts)
          .where(eq(alerts.userId, uid))
          .then((r) => r[0]?.c ?? 0),

        db.select().from(userProfiles)
          .where(eq(userProfiles.userId, uid))
          .limit(1)
          .then((r) => r[0] ?? { plan: "free" }),
      ]);

    return {
      competitorCount: Number(competitorCount),
      unreadCount:     Number(unreadCount),
      totalAlerts:     Number(totalAlerts),
      plan:            profile.plan,
    };
  });
