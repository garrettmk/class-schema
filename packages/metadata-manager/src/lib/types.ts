/* eslint-disable @typescript-eslint/ban-types */

/**
 * A constructor function.
 */
export type Constructor<T = any> = new () => T;

/**
 * A class decorator function.
 */
export type ClassDecorator = (target: Constructor) => Constructor | void;

/**
 * A property key.
 */
export type PropertyKey = string | symbol;

/**
 * A property decorator function.
 */
export type PropertyDecorator = (target: Object, key: PropertyKey) => void;

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
  