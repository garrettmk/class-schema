import { MetadataKeys } from "../types";

/**
 * @param metadata The object to parse
 * @returns All string and symbol keys on `object`
 */
export function metadataKeys<T extends object>(metadata: T): MetadataKeys<T>[] {
    return [
        ...Object.keys(metadata),
        ...Object.getOwnPropertySymbols(metadata)
    ] as MetadataKeys<T>[];
}