export namespace StardewWiki {
  export function sluggify(text: string) {
    return text.replace(/\s+/g, "_").replace(/'/g, ".27");
  }

  export function getLink(page: string, section?: string) {
    return `https://stardewvalleywiki.com/${page}${
      section ? "#" + sluggify(section) : ""
    }`;
  }
}
