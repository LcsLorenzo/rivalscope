import { defineConfig }       from "vite";
import { tanstackStart }      from "@tanstack/react-start/plugin/vite";
import { tanstackRouter }     from "@tanstack/router-plugin/vite";
import tailwindcss            from "@tailwindcss/vite";
import path                   from "node:path";

export default defineConfig({
  plugins: [
    // 1. Router plugin FIRST — scans app/routes/ and generates routeTree.gen.ts
    tanstackRouter({
      target:             "react",
      autoCodeSplitting:  true,
      routesDirectory:    "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
    }),
    // 2. Start plugin — points entry files to app/ instead of default src/
    tanstackStart({
      defaultEntryPaths: {
        client: "./app/client.tsx",
        server: "./app/ssr.tsx",
        start:  "./app/router.tsx",
      },
    }),
    // 3. Tailwind CSS v4
    tailwindcss(),
  ],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./app") },
  },
  server: {
    port: 3000,
  },
});
