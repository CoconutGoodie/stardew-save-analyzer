export class XMLNode {
  public static readonly EMPTY = new XMLNode(undefined);

  constructor(public readonly element: Element | undefined) {}

  public transformIfPresent<R>(transformer: (xml: this) => R) {
    return this.element == null ? undefined : transformer(this);
  }

  public query(selectors: string) {
    return new XMLNode(this.element?.querySelector(selectors) ?? undefined);
  }

  public queryAll(selectors: string) {
    return Array.from(this.element?.querySelectorAll(selectors) ?? []).map(
      (t) => new XMLNode(t)
    );
  }

  public text(defaultValue: string = "") {
    return this.element?.textContent?.trim() ?? defaultValue;
  }

  public number(defaultValue: number = 0) {
    const number = parseInt(this.text());
    return number == null ? defaultValue : number;
  }

  public boolean() {
    return this.text().toLowerCase() === "true";
  }
}
