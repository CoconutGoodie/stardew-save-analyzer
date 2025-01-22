export function reduceIterator<T, R>(
  iter: Iterator<T>,
  reducer: (t: T, prev: R) => R,
  initialResult: R
) {
  let result = initialResult;
  let curr: IteratorResult<T>;

  while (!(curr = iter.next()).done) {
    result = reducer(curr.value, result);
  }

  return result;
}

export function mapIterator<T, R>(iter: Iterator<T>, mapper: (value: T) => R) {
  return reduceIterator(
    iter,
    (value, result) => {
      result.push(mapper(value));
      return result;
    },
    [] as R[]
  );
}
