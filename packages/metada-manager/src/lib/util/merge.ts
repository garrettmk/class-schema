/**
 * Performs a shallow merge of `a` and `b`.
 * 
 * @param a The base object
 * @param b The object to merge onto `a`
 * @returns A shallow merge of `a` and `b`
 */
 export function merge<A extends object, B extends object>(a: A | undefined, b: B | undefined): (A & B) | undefined {
    return a || b ? { ...a, ...b } as A & B : a || b;
}