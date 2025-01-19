// https://vike.dev/Head

import FaviconPng from "../frontend/assets/favicon.gif";

export default function HeadDefault() {
  return (
    <>
      <link rel="icon" href={FaviconPng} />

      {/* <!-- Facebook Meta Tags --> */}
      <meta
        property="og:url"
        content="https://github.com/iGoodie/stardew-save-analyzer"
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Save Analyzer & Tracker for Stardew Valley the Game"
      />
      <meta
        property="og:description"
        content="Save Analyzer & Tracker for Stardew Valley the Game"
      />
      <meta
        property="og:image"
        content="https://repository-images.githubusercontent.com/788195097/286759a7-17ae-46d7-be70-428cb89e0713"
      />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="github.com" />
      <meta
        property="twitter:url"
        content="https://github.com/iGoodie/stardew-save-analyzer"
      />
      <meta
        name="twitter:title"
        content="Save Analyzer & Tracker for Stardew Valley the Game"
      />
      <meta
        name="twitter:description"
        content="Save Analyzer & Tracker for Stardew Valley the Game"
      />
      <meta
        name="twitter:image"
        content="https://repository-images.githubusercontent.com/788195097/286759a7-17ae-46d7-be70-428cb89e0713"
      />

      {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
    </>
  );
}
