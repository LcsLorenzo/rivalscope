import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/start";
import { getRequest } from "@tanstack/start/server";
import { auth } from "~/lib/auth";

/**
 * Auth middleware — protects ALL server functions it is applied to.
 * Usage: createServerFn().middleware([authMiddleware]).handler(...)
 * The session is available type-safely via context.session
 */
export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    if (!request?.headers) throw redirect({ to: "/auth/login" });

    const userSession = await auth.api.getSession({ headers: request.headers });
    if (!userSession) throw redirect({ to: "/auth/login" });

    return next({ context: { session: userSession } });
  }
);

/**
 * Plan gate middleware — restricts access to pro/agency features.
 * Must be composed AFTER authMiddleware.
 */
export const proMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, context }: any) => {
    const plan = context?.session?.user?.plan ?? "free";
    if (plan === "free") {
      throw new Error("UPGRADE_REQUIRED");
    }
    return next({ context });
  }
);
