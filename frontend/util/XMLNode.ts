export class XMLNode {
  public static readonly EMPTY = new XMLNode(undefined);

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
