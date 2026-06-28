import { task, logger } from "@trigger.dev/sdk/v3";
import { db } from "~/lib/db";
import { competitors, alerts, users } from "~/lib/schema";
import { eq, and } from "drizzle-orm";
import { summarizeDiff, detectPriceChange } from "~/lib/ai";
import { sendAlertEmail } from "~/lib/email";
import { absoluteUrl } from "~/lib/utils";
import { isProOrHigher } from "~/lib/plan";

export const checkCompetitorTask = task({
  id: "check-competitor",
  maxDuration: 120, // 2 minutes timeout
  run: async (payload: { competitorId: string }) => {
    const { competitorId } = payload;

    logger.info("Checking competitor", { competitorId });

    // 1. Fetch competitor + user
    const competitor = await db.query.competitors.findFirst({
      where: and(
        eq(competitors.id, competitorId),
        eq(competitors.status, "active")
      ),
    });

    if (!competitor) {
      logger.warn("Competitor not found or paused", { competitorId });
      return;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, competitor.userId),
    });

    if (!user) return;

    // 2. Scrape current page
    let newSnapshot: string;
    try {
      const res = await fetch(competitor.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RivalScope/1.0; +https://rivalscope.com)",
        },
        signal: AbortSignal.timeout(30_000),
      });
      newSnapshot = await res.text();
    } catch (err) {
      logger.error("Failed to fetch competitor URL", { url: competitor.url, err });
      await db
        .update(competitors)
        .set({ status: "error" })
        .where(eq(competitors.id, competitorId));
      return;
    }

    // 3. Update last checked
    await db
      .update(competitors)
      .set({ lastCheckedAt: new Date() })
      .where(eq(competitors.id, competitorId));

    // 4. If no previous snapshot, just store it
    if (!competitor.lastSnapshot) {
      await db
        .update(competitors)
        .set({ lastSnapshot: newSnapshot })
        .where(eq(competitors.id, competitorId));
      logger.info("First snapshot saved", { competitorId });
      return;
    }

    // 5. Detect changes
    const hasChanged = competitor.lastSnapshot !== newSnapshot;
    if (!hasChanged) {
      logger.info("No changes detected", { competitorId });
      return;
    }

    // 6. Detect price change
    const priceChanged = await detectPriceChange(
      competitor.lastSnapshot,
      newSnapshot
    );

    // 7. Generate AI summary (only for Pro/Agency)
    let summary = "Changes detected on competitor site.";
    if (isProOrHigher(user.plan)) {
      try {
        summary = await summarizeDiff(
          competitor.name,
          competitor.lastSnapshot,
          newSnapshot
        );
      } catch (err) {
        logger.warn("AI summary failed, using default", { err });
      }
    }

    // 8. Create alert
    const alertTitle = priceChanged
      ? `Price change detected on ${competitor.name}`
      : `Content update on ${competitor.name}`;

    const [newAlert] = await db
      .insert(alerts)
      .values({
        competitorId,
        userId: competitor.userId,
        type: priceChanged ? "price_change" : "content_change",
        title: alertTitle,
        summary,
      })
      .returning();

    // 9. Send email notification (Pro/Agency only)
    if (newAlert && isProOrHigher(user.plan) && user.email) {
      try {
        await sendAlertEmail({
          to: user.email,
          competitorName: competitor.name,
          alertTitle,
          summary,
          dashboardUrl: absoluteUrl("/dashboard/alerts"),
        });
        await db
          .update(alerts)
          .set({ emailSent: true })
          .where(eq(alerts.id, newAlert.id));
      } catch (err) {
        logger.warn("Email send failed", { err });
      }
    }

    // 10. Update snapshot
    await db
      .update(competitors)
      .set({ lastSnapshot: newSnapshot })
      .where(eq(competitors.id, competitorId));

    logger.info("Alert created", { alertId: newAlert?.id, type: priceChanged ? "price" : "content" });
  },
});

// Scheduled task: trigger all active competitors checks
export const scheduleAllChecksTask = task({
  id: "schedule-all-checks",
  run: async () => {
    const activeCompetitors = await db.query.competitors.findMany({
      where: eq(competitors.status, "active"),
      columns: { id: true },
    });

    logger.info(`Scheduling checks for ${activeCompetitors.length} competitors`);

    for (const competitor of activeCompetitors) {
      await checkCompetitorTask.trigger({ competitorId: competitor.id });
    }
  },
});
