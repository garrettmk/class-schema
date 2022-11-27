import { MetadataDict, MetadataKey } from "../types";
import { metadataEntries } from "./entries";

export function mapMetadataProperties(metadata: MetadataDict, callback: (propertyMetadata: Values<MetadataDict>, propertyKey: MetadataKey) => Values<MetadataDict>): MetadataDict {
    return metadataEntries(metadata).reduce(
        (result, [propertyKey, propertyMetadata]) => {
            result[propertyKey] = callback(propertyMetadata, propertyKey);
            return result;
        },
        metadata
    ) ?? metadata;
}