import { entries } from "remeda";

export class AssetRepository<T> {
  constructor(
    private options: {
      repository: Record<string, T>;
      prefix: string;
      postfix: string;
      defaultKey?: string;
    }
  ) {}

  public resolve(assetName: string) {
    const { repository, prefix, postfix, defaultKey } = this.options;

    return (
      repository[`${prefix}${assetName}${postfix}`] ??
      repository[`${prefix}${defaultKey}${postfix}`] ??
      (entries(repository).at(0)?.[1] as T)
    );
  }
}
