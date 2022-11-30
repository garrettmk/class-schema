import { Values } from "@garrettmk/ts-utils";
import { MetadataDict } from "../types";
import { metadataKeys } from "./metadata-keys";

/**
 * Returns an array of all entries in `metadata`. Includes symbol keys.
 * 
 * @param metadata The `Metadata` object to parse
 * @returns An array of [MetadataKey, Values<Metadata>] entries.
 */
export function metadataEntries<Metadata extends MetadataDict>(metadata: Metadata): [keyof Metadata, Values<Metadata>][] {
    const keys = metadataKeys(metadata);
    
    return keys.map(key => [key, metadata[key]]);
}