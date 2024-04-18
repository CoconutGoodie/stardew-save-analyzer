import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import content from "@originjs/vite-plugin-content";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    content({
      xml: {
        enabled: true,
        xml2jsOptions: {
          trim: true,
          // attrkey: "$attr",
          // explicitArray: false,
          preserveChildrenOrder: true,
        },
      },
    }),
  ],
});
