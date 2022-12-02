import { MetadataKeys, MetadataValues } from '../types';
import { metadataEntries } from './metadata-entries';

/**
 * Maps all keys of `metadata` to new values using `callback`.
 *
 * @param metadata The object to map
 * @param callback Returns a new value for each property in `metadata`
 * @returns A new metadata object
 */
export function mapMetadataProperties<Metadata extends object>(
  metadata: Metadata,
  callback: (propertyMetadata: MetadataValues<Metadata>, propertyKey: MetadataKeys<Metadata>) => MetadataValues<Metadata>
): Metadata {
  return (
    metadataEntries(metadata).reduce((result, [propertyKey, propertyMetadata]) => Object.assign(result, {
      [propertyKey]: callback(propertyMetadata, propertyKey)
    }), metadata) ?? metadata
  );
}
