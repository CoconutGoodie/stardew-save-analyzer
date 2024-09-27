import path from "node:path";
import { defineConfig } from "vite";

import content from "@originjs/vite-plugin-content";
import react from "@vitejs/plugin-react";
import richSvg from "vite-plugin-react-rich-svg";

import PackageJSON from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    richSvg(),
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
