import { redirect }        from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequest }    from "@tanstack/react-start/server";
import { auth }             from "~/lib/auth";

/**
 * Auth middleware — attach to any server function that needs a logged-in user.
 * Usage: createServerFn().middleware([authMiddleware]).handler(async ({ context }) => {
 *   context.user     // Better Auth user object
 *   context.session  // Better Auth session object
 * })
 */
export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      throw redirect({ to: "/auth/login" });
    }

    return next({
      context: {
        user:    session.user,
        session: session.session,
      },
    });
  }
);
