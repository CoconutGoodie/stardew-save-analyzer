import { entries, isPlainObject } from "remeda";

export function useObjectives<const T extends Record<string, unknown>>(
  objectives: T
) {
  const flattenedEntries = extractFlattenedEntries(objectives);

  return {
    objectives,
    allDone: flattenedEntries.every(([_, value]) => !!value),
  };
}

function extractFlattenedEntries<T extends Record<string, unknown>>(obj: T) {
  const extractedEntries: [string, unknown][] = [];

  entries(obj).map(([key, value]) => {
    if (isPlainObject(value)) {
      extractedEntries.push(
        ...extractFlattenedEntries(value).map(
          ([k, v]) => [`${key}_${k}`, v] as [string, unknown]
        )
      );
    } else {
      extractedEntries.push([key, value]);
    }
  });

  return extractedEntries;
}
