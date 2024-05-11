import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import content from "@originjs/vite-plugin-content";
import path from "node:path";

import PackageJSON from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    content({
      xml: {
        enabled: false,
        xml2jsOptions: {
          trim: true,
          // attrkey: "$attr",
          // explicitArray: false,
          preserveChildrenOrder: true,
        },
      },
    }),
  ],
  define: {
    "process.env.APP_VERSION": JSON.stringify(PackageJSON.version),
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
});
