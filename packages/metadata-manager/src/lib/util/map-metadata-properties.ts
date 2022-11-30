import { Values } from '@garrettmk/ts-utils';
import { MetadataDict } from '../types';
import { metadataEntries } from './metadata-entries';

/**
 * Maps all keys of `metadata` to new values using `callback`.
 *
 * @param metadata The object to map
 * @param callback Returns a new value for each property in `metadata`
 * @returns A new metadata object
 */
export function mapMetadataProperties<Metadata extends MetadataDict>(
  metadata: Metadata,
  callback: (propertyMetadata: Values<Metadata>, propertyKey: keyof Metadata) => Values<Metadata>
): Metadata {
  return (
    metadataEntries(metadata).reduce((result, [propertyKey, propertyMetadata]) => {
      result[propertyKey] = callback(propertyMetadata, propertyKey);
      return result;
    }, metadata) ?? metadata
  );
}
