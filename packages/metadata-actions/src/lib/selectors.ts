import { metadataEntries } from "@garrettmk/metadata-manager";
import { MetadataSelector, MetadataTypeGuard } from "./types";

export function always() {
  return true;
}

/**
 * Returns a `MetadataTypeGuard` that returns `true` if all the given keys
 * are present in the metadata.
 * 
 * @example ```typescript
 * 
 * const hasGreeting = isSet('greeting');
 * 
 * hasGreeting({ greeting: 'hello' }); // true
 * hasGreeting({}); //false
 * ```
 * 
 * @param keys One or more keys of `Metadata`
 * @returns A `MetadataTypeGuard`
 */
export function isSet<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Required<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Required<Pick<Metadata, Key>> {
      return keys.every(key => key in metadata);
  }
}

/**
 * Returns a `MetadataSelector` that returns `true` if any of the given keys
 * are present in the metadata.
 * 
 * @example ```typescript
 * 
 * const saysThings = isAnySet('greeting', 'farewell');
 * 
 * saysThings({ farewell: 'bye' });   // true
 * saysThings({ greeting: 'hello' }); // true
 * saysThings({});                    // false
 * ```
 * 
 * @param keys One or more keys of `Metadata`
 * @returns A `MetadataSelector`
 */
export function isAnySet<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataSelector<Metadata> {
  return function (metadata) {
      return keys.some(key => key in metadata);
  };
}

/**
 * Returns a `MetadataTypeGuard` that returns `true` if all the given keys
 * are not present (or have a value of undefined) in the metadata.
 * 
 * @example ```typescript
 * 
 * const hatesGoodbyes = isUnset('farewell');
 * 
 * hatesGoodbyes({ farewell: 'bye' });    // false
 * hatesGoodsbyes({});                    // true
 * ```
 * 
 * @param keys One or more keys of `Metadata`
 * @returns A `MetadataTypeGuard`
 */
export function isUnset<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Partial<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Record<Key, undefined> {
      return keys.every(key => !(key in metadata) || metadata[key] === undefined);
  }
}

/**
 * Returns a `MetadataTypeGuard` that returns `true` if the metadata matches
 * `fragment`.
 * 
 * @example ```typescript
 * 
 * const saysBye = matchesMetadata({ farewell: 'bye' });
 * 
 * saysBye({ greeting: 'hello', farewell: 'bye' });   // true
 * saysBye({ farewell: 'never!' });                   // false
 * ```
 * 
 * @param match A partial `Metadata`
 * @returns A `MetadataTypeGuard`
 */
export function matchesMetadata<Metadata extends object, Key extends keyof Metadata, Match = Pick<Metadata, Key>>(match: Match): MetadataTypeGuard<Metadata, Match & Metadata> {
  return function (metadata): metadata is Match & Metadata {
    return metadataEntries(match as unknown as Metadata).every(
      ([key, value]) => metadata[key as keyof Metadata] === value
    );
  };
}

/**
 * Returns a `MetadataSelector` that returns true if the context matches `match`
 * 
 * @example ```typescript
 * 
 * 
 * ```
 * 
 * @param match A partial `Context`
 * @returns A `MetadataSelector`
 */
export function matchesContext<Context extends object>(match: Partial<Context>): MetadataSelector<unknown, Context> {
  return function (metadata, context): boolean {
    return metadataEntries(match).every(
      ([key, value]) => context[key as keyof Context] === value
    );
  };
}