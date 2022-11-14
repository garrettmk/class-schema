/**
 * Returns `value` if `value` is an array, otherwise wraps `value`
 * in an array before returning it.
 *
 * @param value A value of type T, or an array of items of type T
 * @returns An array of items of type T
 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
