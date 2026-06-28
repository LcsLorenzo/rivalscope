import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "~/lib/auth";

/**
 * Better Auth catch-all handler.
 * Handles: /api/auth/sign-in, /api/auth/sign-up, /api/auth/session,
 *          /api/auth/sign-out, OAuth callbacks, etc.
 */
export const APIRoute = createAPIFileRoute("/api/auth/$")(
  auth.handler as any
);
