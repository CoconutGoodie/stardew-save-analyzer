export function thru<V, R>(value: V, consumer: (v: V) => R) {
  return consumer(value);
}

export function isKeyOf(
  key: PropertyKey,
  object: object
): key is keyof typeof object {
  return key in object;
}
