import { createAPIFileRoute } from "@tanstack/start/api";
import { db } from "~/lib/db";
import { sql } from "drizzle-orm";

export const APIRoute = createAPIFileRoute("/api/health")({
  GET: async 