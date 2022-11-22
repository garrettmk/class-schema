/* eslint-disable @typescript-eslint/ban-types */

/**
 * A constructor function.
 */
export type Constructor<T = any> = new () => T;

/**
 * A property key.
 */
export type PropertyKey = string | symbol;

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
  