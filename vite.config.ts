import { defineConfig }   from "vite";
import { tanstackStart }  from "@tanstack/react-start/plugin/vite";
import tailwindcss        from "@tailwindcss/vite";
import path               from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({ target: "node-server" }),
  ],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./app") },
  },
  server: {
    port: 3000,
  },
});
