export const emptyToUndefined = <T extends Record<string, unknown>>(values: T) => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === "" ? undefined : value])
  ) as T;
};
