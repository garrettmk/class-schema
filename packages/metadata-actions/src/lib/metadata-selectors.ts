
export type MetadataSelector<Metadata, Context = unknown> =
  (metadata: Metadata, context: Context) => unknown;

export type MetadataTypeGuard<Metadata, Subtype extends Metadata, Context = unknown> =
  (metadata: Metadata, context: Context) => metadata is Subtype;


export function hasKeys<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Required<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Required<Pick<Metadata, Key>> {
      return keys.every(key => key in metadata);
  }
}

export function hasAnyKeys<Metadata extends object>(...keys: PropertyKey[]): MetadataSelector<Metadata> {
  return function (metadata) {
      return keys.some(key => key in metadata);
  };
}

export function isUnset<Metadata extends object, Key extends keyof Metadata>(...keys: Key[]): MetadataTypeGuard<Metadata, Metadata & Partial<Pick<Metadata, Key>>> {
  return function (metadata): metadata is Metadata & Record<Key, undefined> {
      return !keys.every(key => metadata[key] === undefined);
  }
}

export function matchesMetadata<Metadata extends object, Context = unknown>(match: Partial<Metadata>): MetadataSelector<Metadata, Context> {
  return function (field): boolean {
      return Object.entries(match).every(
          ([key, value]) => field[key as keyof Metadata] === value
      );
  }
}
