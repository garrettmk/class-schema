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

export type MetadataKeys<T extends object, K extends keyof T = keyof T> = K extends MetadataKey ? K : never;

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
  