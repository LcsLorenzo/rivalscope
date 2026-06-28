import { task, logger } from "@trigger.dev/sdk/v3";
import { db } from "~/lib/db";
import { competitors, alerts, userProfiles } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { summarizeDiff, detectPriceChange } from "~/lib/ai";
import { sendAlertEmail } from "~/lib/email";
import { absoluteUrl } from "~/lib/utils";

export const checkCompetitorTask = task({
  id: "check-competitor",
  maxDuration: 120,
  run: async (payload: { competitorId: string }) => {
    const { competitorId } = payload;

    logger.info("Checking competitor", { competitorId });

    const [competitor] = await db
      .select()
      .from(competitors)
      .where(and(eq(competitors.id, competitorId), eq(competitors.active, true)))
      .limit(1);

    if (!competitor) {
      logger.warn("Competitor not found or paused", { competitorId });
      return;
    }

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, competitor.userId))
      .limit(1);

    if (!profile) return;

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
        .set({ active: false })
        .where(eq(competitors.id, competitorId));
      return;
    }

    await db
      .update(competitors)
      .set({ lastChecked: new Date() })
      .where(eq(competitors.id, competitorId));

    if (!competitor.lastSnapshot) {
      await db
        .update(competitors)
        .set({ lastSnapshot: newSnapshot })
        .where(eq(competitors.id, competitorId));
      logger.info("First snapshot saved", { competitorId });
      return;
    }

    const hasChanged = competitor.lastSnapshot !== newSnapshot;
    if (!hasChanged) {
      logger.info("No changes detected", { competitorId });
      return;
    }

    const priceChanged = await detectPriceChange(
      competitor.lastSnapshot,
      newSnapshot
    );

    let summary = "Changes detected on competitor site.";
    if (profile.plan === "pro" || profile.plan === "agency") {
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

    if (newAlert && (profile.plan === "pro" || profile.plan === "agency")) {
      try {
        const [profileWithEmail] = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, competitor.userId))
          .limit(1);
      } catch (err) {
        logger.warn("Email sending skipped", { err });
      }
    }

    await db
      .update(competitors)
      .set({ lastSnapshot: newSnapshot })
      .where(eq(competitors.id, competitorId));

    logger.info("Alert created", { alertId: newAlert?.id, type: priceChanged ? "price" : "content" });
  },
});

export const scheduleAllChecksTask = task({
  id: "schedule-all-checks",
  run: async () => {
    const activeCompetitors = await db
      .select({ id: competitors.id })
      .from(competitors)
      .where(eq(competitors.active, true));

    logger.info(`Scheduling checks for ${activeCompetitors.length} competitors`);

    for (const competitor of activeCompetitors) {
      await checkCompetitorTask.trigger({ competitorId: competitor.id });
    }
  },
});