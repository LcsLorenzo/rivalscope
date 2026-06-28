import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "~/lib/auth";

/**
 * Better Auth catch-all route.
 * Handles: sign-in, sign-up, sign-out, OAuth callbacks, email verification, etc.
 */
export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request),
});
