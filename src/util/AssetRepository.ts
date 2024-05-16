import { entries } from "remeda";

/** @deprecated */
export class AssetRepositoryOLD<T> {
  constructor(
    private repository: Record<string, T>,
    private prefix: string,
    private postfix: string
  ) {}

  public resolve(assetName: string) {
    return this.repository[`${this.prefix}${assetName}${this.postfix}`];
  }
}

export class AssetRepository<T> {
  constructor(
    private options: {
      repository: Record<string, T>;
      prefix: string;
      postfix: string;
      defaultValue?: T;
    }
  ) {}

  public resolve(assetName: string) {
    const { repository, prefix, postfix, defaultValue } = this.options;

    return (repository[`${prefix}${assetName}${postfix}`] ??
      defaultValue ??
      entries(repository).at(0)) as T;
  }
}
