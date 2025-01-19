import { MainLayout } from "pages/MainLayout";
import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout: MainLayout,

  // https://vike.dev/head-tags
  title: "Stardew Save Analyzer",
  description: "Save Analyzer & Tracker for Stardew Valley the Game",
  // image:
  //   "https://repository-images.githubusercontent.com/788195097/286759a7-17ae-46d7-be70-428cb89e0713",

  extends: vikeReact,
} satisfies Config;
