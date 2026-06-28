import { createFileRoute } from "@tanstack/react-router";
import { db } from "~/lib/db";
import { sql } from "drizzle-orm";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const result = await db.execute(sql`SELECT 1 AS ok`);
          return new Response(JSON.stringify({ status: "ok", db: "connected", result }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ status: "error", message: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
