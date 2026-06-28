import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routeTree }  from "./routeTree.gen";

let router: ReturnType<typeof createTanstackRouter>;

export function createRouter() {
  if (!router) {
    router = createTanstackRouter({
      routeTree,
      defaultPreload:      "intent",
      defaultPreloadDelay: 100,
      scrollRestoration:   true,
    });
  }
  return router;
}

export function getRouter() {
  return createRouter();
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
