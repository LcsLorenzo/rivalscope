import { defineConfig }       from "vite";
import { tanstackStart }      from "@tanstack/react-start/plugin/vite";
import { tanstackRouter }     from "@tanstack/router-plugin/vite";
import tailwindcss            from "@tailwindcss/vite";
import path                   from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target:             "react",
      autoCodeSplitting:  true,
      routesDirectory:    "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
    }),
    tanstackStart({
      srcDirectory: "./app",
      router:       { entry: "./router.tsx" },
      client:       { entry: "./client.tsx" },
      server:       { entry: "./ssr.tsx" },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./app") },
  },
  server: {
    port: 3000,
  },
});
