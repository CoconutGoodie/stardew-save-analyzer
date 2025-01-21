class KnownElement<T extends HTMLElement> {
  constructor(protected _id: string) {}

  get id() {
    return this._id;
  }

  get() {
    return document.getElementById(this._id) as T | null;
  }

  async scrollInto() {
    const element = this.get();

    if (!element) {
      throw new Error(
        `Element is not present in the current DOM. (${this._id})`
      );
    }

    return new Promise<NonNullable<T>>((resolve) => {
      const handler = () => {
        resolve(element);
        window.removeEventListener("scrollend", handler);
      };

      window.addEventListener("scrollend", handler);

      element.scrollIntoView({
        block: "nearest",
      });
    });
  }
}

export const KnownElements = {
  DISCLAIMERS: new KnownElement<HTMLDivElement>("disclaimers"),
};
