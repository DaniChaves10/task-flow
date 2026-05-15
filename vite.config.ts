import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        recoil: path.resolve(__dirname, "src/lib/recoil-shim.tsx"),
      },
    },
  },
});
