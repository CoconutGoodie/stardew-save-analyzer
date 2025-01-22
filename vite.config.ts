import path from "node:path";
import { defineConfig } from "vite";

import content from "@originjs/vite-plugin-content";
import react from "@vitejs/plugin-react";
import { swc } from "rollup-plugin-swc3";
import { vavite } from "vavite";
import vike from "vike/plugin";
import { patchCssModules } from "vite-css-modules";
import richSvg from "vite-plugin-react-rich-svg";

import PackageJSON from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  buildSteps: [
    {
      name: "client",
    },
    {
      name: "server",
      config: {
        build: { ssr: true },
      },
    },
  ],
  ssr: {
    external: ["reflect-metadata"],
  },
  css: {
    // TODO:
    // postcss: {
    //   plugins: [autoprefixer()],
    // },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  esbuild: false,
  plugins: [
    {
      ...swc({
        jsc: {
          // baseUrl: join(__dirname, "./src"),
          paths: {
            "*": ["*"],
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true,
          },
          target: "es2017",
        },
      }),
      enforce: "pre",
    },
    vavite({
      handlerEntry: "/server/main.ts",
      serveClientAssetsInDev: true,
    }),
    react(),
    vike({ disableAutoFullBuild: true }),
    patchCssModules(),
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
      "~common/": path.resolve(__dirname, "./common"),
      "~frontend/": path.resolve(__dirname, "./frontend"),
      "~server/": path.resolve(__dirname, "./server"),
    },
  },
});
