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
export type MetadataKeys<T extends object, K extends keyof T = keyof T> = K extends MetadataKey ? K : never;

/**
 * A metadata dictionary.
 */
export type MetadataDict<Property = unknown, Key extends MetadataKey = MetadataKey> = Record<Key, Property>;

/**
 * A metadata manager class.
 */
export interface MetadataManager<Metadata = MetadataDict, Target = unknown> {
    metadatas: Map<Target, Metadata>
    hasMetadata(target: Target): boolean
    getMetadata(target: Target): Metadata
    setMetadata(target: Target, meta: Metadata): void
    mergeMetadata(target: Target, meta: Metadata): void
    entries(): [Target, Metadata][]
  }
  