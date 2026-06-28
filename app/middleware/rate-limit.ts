import { createMiddleware } from "@tanstack/react-start";
import { getRequest }    from "@tanstack/react-start/server";

/** Simple in-memory rate limiter (swap for Upstash Redis in production) */
const store = new Map<string, { count: number; resetAt: number }>();

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function createRateLimiter(limit: number, windowMs: number) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const req = getRequest();
    const ip  = getIp(req);
    const now = Date.now();

    let entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
    }
    entry.count++;
    store.set(ip, entry);

    if (entry.count > limit) {
      throw new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    return next();
  });
}

/** 20 req / 60s — for auth endpoints */
export const authRateLimit = createRateLimiter(20, 60_000);

/** 60 req / 60s — for general API */
export const apiRateLimit  = createRateLimiter(60, 60_000);
