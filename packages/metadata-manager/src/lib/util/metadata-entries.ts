import { MetadataKeys, MetadataValues } from "../types";
import { metadataKeys } from "./metadata-keys";

/**
 * Returns an array of all entries in `metadata`. Includes symbol keys.
 * 
 * @param metadata The `Metadata` object to parse
 * @returns An array of [MetadataKey, Values<Metadata>] entries.
 */
export function metadataEntries<Metadata extends object>(metadata: Metadata): [MetadataKeys<Metadata>, MetadataValues<Metadata>][] {
    const keys = metadataKeys(metadata);
    
    return keys.map(key => [key, metadata[key]]);
}