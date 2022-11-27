import { entries } from "./util/entries";

export type MetadataSelector<Metadata, Context = unknown> =
  (metadata: Metadata, context: Context) => unknown;

export type MetadataTypeGuard<Metadata, Subtype extends Metadata, Context = unknown> =
  (metadata: Metadata, context: Context) => metadata is Subtype;


export function isSet<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Required<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Required<Pick<Metadata, Key>> {
      return keys.every(key => key in metadata);
  }
}

export function isAnySet<Metadata extends object>(...keys: PropertyKey[]): MetadataSelector<Metadata> {
  return function (metadata) {
      return keys.some(key => key in metadata);
  };
}

export function isUnset<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Partial<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Record<Key, undefined> {
      return keys.every(key => !(key in metadata) || metadata[key] === undefined);
  }
}

export function matchesMetadata<Metadata extends object, Key extends keyof Metadata, Match = Pick<Metadata, Key>>(match: Match): MetadataTypeGuard<Metadata, Match & Metadata> {
  return function (metadata): metadata is Match & Metadata {
    return entries(match as unknown as object).every(
      ([key, value]) => metadata[key as keyof Metadata] === value
    );
  };
}

export function matchesContext<Context extends object>(match: Partial<Context>): MetadataSelector<unknown, Context> {
  return function (metadata, context): boolean {
    return entries(match).every(
      ([key, value]) => context[key as keyof Context] === value
    );
  };
}