import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      target: "node-server",
      // Tell TanStack Start where our entry files live (app/ not src/)
      router: {
        routesDirectory: "./app/routes",
        generatedRouteTree: "./app/routeTree.gen.ts",
      },
      entries: {
        client: "./app/client.tsx",
        server: "./app/ssr.tsx",
        router: "./app/router.tsx",
      },
    }),
  ],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./app") },
  },
  server: {
    port: 3000,
  },
});
