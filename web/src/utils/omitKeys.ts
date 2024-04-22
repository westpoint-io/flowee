/**
 * Omit specified keys from an object.
 *
 * @param keys - An array of keys to omit.
 * @param obj - The object from which to omit the keys.
 * @returns A new object with the specified keys omitted.
 */
export function omit<T extends object, K extends keyof T>(keys: K[], obj: T) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj as Omit<T, K>;
}
