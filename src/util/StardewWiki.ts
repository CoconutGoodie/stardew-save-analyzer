export namespace StardewWiki {
  export function getLink(page: string, section?: string) {
    return `https://stardewvalleywiki.com/${page}${
      section ? "#" + section : ""
    }`;
  }
}
