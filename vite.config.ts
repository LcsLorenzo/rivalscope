import { defineConfig }      from "vite";
import { tanstackStart }     from "@tanstack/react-start/plugin/vite";
import tailwindcss           from "@tailwindcss/vite";
import tsConfigPaths         from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      // Vite-based TanStack Start config (replaces app.config.ts / vinxi)
      target: "node-server",
      react: {
        babel: {
          plugins: [["babel-plugin-react-compiler", { target: "19" }]],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
});
