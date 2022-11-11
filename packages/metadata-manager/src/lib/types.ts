
/**
 * A class decorator function.
 */
export type ClassDecorator<T = unknown> = (target: T) => T | void;

/**
 * A property key.
 */
export type PropertyKey = string | symbol;

/**
 * A property decorator function.
 */
export type PropertyDecorator<T = object> = (target: T, key: PropertyKey) => void;

/**
 * A valid metadata key.
 */
export type MetadataKey = string | symbol;

/**
 * A metadata dictionary.
 */
export type MetadataDict<MetadataField = unknown> = Record<MetadataKey, MetadataField>;

/**
 * A metadata manager class.
 */
export interface MetadataManager<Metadata = MetadataDict, Target = unknown> {
    hasMetadata(target: Target): boolean
    getMetadata(target: Target): Metadata
    setMetadata(target: Target, meta: Metadata): void
    mergeMetadata(target: Target, meta: Metadata): void
    entries(): [Target, Metadata][]
  }
  