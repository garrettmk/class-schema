
/**
 * A property key.
 */
 export type PropertyKey = string | symbol;


/**
 * A value of type T, or an array of items of type T
 */
export type MaybeArray<T> = T | T[];


/**
 * An object type's values type
 */
export type Values<T extends object> = T[keyof T];