/**
 * A property key.
 */
export type PropertyKey = string | symbol;

/**
 * A valid metadata key.
 */
export type MetadataKey = string | symbol;

/**
 * All string and symbol keys of `T"
 */
export type MetadataKeys<T extends object, K extends keyof T = keyof T> = K extends MetadataKey
    ? K
    : never;

/**
 * All values of string and symbol keys of T
 */
export type MetadataValues<T extends object> = T[MetadataKeys<T>];

/**
 * A metadata dictionary.
 */
export type MetadataDict<Property = unknown, Key extends MetadataKey = MetadataKey> = Record<
    Key,
    Property
>;