/**
 * A class constructor.
 */
export type Constructor<T = any>= new () => T;

export type AnyFunction = () => any;

export type ClassDecorator<T> = (target: T) => T | void;

export type PropertyKey = string | symbol;

export type PropertyDecorator<T = object> = (target: T, key: PropertyKey) => void;

export type MetadataKey = string | symbol;

export type MetadataDict<MetadataField = unknown> = Record<MetadataKey, MetadataField>;

export interface MetadataManager<Metadata = MetadataDict, Target = unknown> {
    hasMetadata(target: Target): boolean
    getMetadata(target: Target): Metadata
    setMetadata(target: Target, meta: Metadata): void
    mergeMetadata(target: Target, meta: Metadata): void
    entries(): [Target, Metadata][]
  }
  