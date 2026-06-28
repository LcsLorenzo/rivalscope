import { createServerFn } from "@tanstack/react-start";
import { z }              from "zod";
import { eq, and, desc }  from "drizzle-orm";
import { db }             from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";
import { alerts }         from "../../drizzle/schema";

export const listAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, context.user.id))
      .orderBy(desc(alerts.createdAt))
      .limit(100);
  });

export const markAlertRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const [updated] = await db
      .update(alerts)
      .set({ status: "read" })
      .where(and(
        eq(alerts.id, data.id),
        eq(alerts.userId, context.user.id),
      ))
      .returning();
    return updated;
  });

export const markAllRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await db
      .update(alerts)
      .set({ status: "read" })
      .where(eq(alerts.userId, context.user.id));
    return { success: true };
  });
