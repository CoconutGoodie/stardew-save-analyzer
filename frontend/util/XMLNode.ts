export class XMLNode {
  public static readonly EMPTY = new XMLNode(undefined);

  public static fromText(raw: string) {
    const xml = new DOMParser().parseFromString(raw, "text/xml") as XMLDocument;
    return new XMLNode(xml.documentElement);
  }

  public static async fromFile(file: File) {
    return new Promise<XMLNode>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          resolve(XMLNode.fromText(reader.result as string));
        } catch (error) {
          reject(error as Error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Error occurred while reading the file."));
      };

      reader.readAsText(file);
    });
  }

  constructor(public readonly element: Element | undefined) {}

  public transformIfPresent<R>(transformer: (xml: this) => R) {
    return this.element == null ? undefined : transformer(this);
  }

  public parent() {
    return new XMLNode(this.element?.parentElement ?? undefined);
  }

  public query(selectors: string) {
    return new XMLNode(this.element?.querySelector(selectors) ?? undefined);
  }

  public queryAll(selectors: string) {
    return Array.from(this.element?.querySelectorAll(selectors) ?? []).map(
      (t) => new XMLNode(t)
    );
  }

  // TODO: Remove, why is this even a thing?
  public queryAllAndFind(
    selectors: string,
    predicate: (node: XMLNode) => boolean
  ) {
    return this.queryAll(selectors).find(predicate) ?? XMLNode.EMPTY;
  }

  public text(defaultValue: string = "") {
    return this.element?.textContent?.trim() ?? defaultValue;
  }

  public number(defaultValue: number = 0) {
    const text = this.text();
    if (!text) return defaultValue;
    const number = parseInt(text);
    return number == null ? defaultValue : number;
  }

  public boolean() {
    return this.text().toLowerCase() === "true";
  }
}
