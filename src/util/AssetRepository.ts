export class AssetRepository<T> {
  constructor(
    private repository: Record<string, T>,
    private prefix: string,
    private postfix: string
  ) {}

  public resolve(assetName: string) {
    return this.repository[`${this.prefix}${assetName}${this.postfix}`];
  }
}
