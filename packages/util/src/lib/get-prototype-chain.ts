/**
 *
 * @param target The class constructor to evaluate
 * @returns A list of `target`'s parent constructors.
 */
export function getPrototypeChain<T>(target: T): T[] {
  const result: T[] = [];
  let proto = Object.getPrototypeOf(target);

  while (typeof proto === 'function' && proto !== Function.prototype) {
    result.push(proto);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
}
