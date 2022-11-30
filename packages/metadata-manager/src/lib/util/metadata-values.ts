import { MetadataKeys } from "../types";
import { metadataKeys } from "./metadata-keys";

/**
 * @param metadata The object to parse
 * @returns All string and symbol keys on `object`
 */
export function metadataValues<Metadata extends object>(metadata: Metadata): Metadata[MetadataKeys<Metadata>][] {
    const keys = metadataKeys(metadata);

    return keys.map(key => metadata[key])
}