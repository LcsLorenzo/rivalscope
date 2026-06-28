import { createAPIFileRoute } from "@tanstack/start/api";
import { db } from "~/lib/db";
import { sql } from "drizzle-orm";

/**
 * Health check endpoint — used by Vercel, uptime monitors, etc.
 * GET /api/health → { status: "ok", db: "ok", ts: "..." }
 */
export const APIRoute = createAPIFileRoute("/api/health")({
  GET: async () => {
    let dbStatus = "ok";
    try {
      await db.execute(sql`SELECT 1`);
    } catch {
      dbStatus = "error";
    }
    return new Response(
      JSON.stringify({ status: "ok", db: dbStatus, ts: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
});
