export function thru<V, R>(value: V, consumer: (v: V) => R) {
  return consumer(value);
}
