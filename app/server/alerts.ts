import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { db } from "~/lib/db";
import { alerts } from "~/lib/schema";
import { authMiddleware } from "~/middleware/auth";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    return db.query.alerts.findMany({
      where: eq(alerts.userId, userId),
      orderBy: [desc(alerts.createdAt)],
      limit: 50,
      with: { competitor: { columns: { name: true, url: true } } },
    });
  });

export const markAlertSeen = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    await db
      .update(alerts)
      .set({ seen: true })
      .where(and(eq(alerts.id, data.id), eq(alerts.userId, userId)));
    return { success: true };
  });

export const markAllAlertsSeen = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    await db
      .update(alerts)
      .set({ seen: true })
      .where(and(eq(alerts.userId, userId), eq(alerts.seen, false)));
    return { success: true };
  });
