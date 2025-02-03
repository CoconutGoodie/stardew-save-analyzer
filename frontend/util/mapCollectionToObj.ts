type StrictOmit<T, K> = K extends keyof T
  ? Prettify<Pick<T, Exclude<keyof T, K>>>
  : T;

export function mapCollectionToObj<
  const TItem extends Record<TDiscriminator, string>,
  const TDiscriminator extends keyof TItem,
>(collection: TItem[], discriminatorKey: TDiscriminator) {
  return <
    const TMapper extends (
      item: TItem
    ) => StrictOmit<ReturnType<TMapper>, TDiscriminator>,
  >(
    mapper: TMapper
  ) => {
    return collection.reduce(
      (acc, item) => {
        const key = item[discriminatorKey];
        const { [discriminatorKey]: _, ...rest } = mapper(item);
        acc[key] = rest as StrictOmit<ReturnType<TMapper>, TDiscriminator>;
        return acc;
      },
      {} as {
        [Key in TItem[TDiscriminator]]: StrictOmit<
          ReturnType<TMapper>,
          TDiscriminator
        >;
      }
    );
  };
}
