import { MetadataDict, MetadataKey } from "../types";
import { Values } from "@garrettmk/ts-utils";

export function metadataEntries<Metadata extends MetadataDict>(metadata: Metadata): [MetadataKey, Values<Metadata>][] {
    const metadataKeys = [
        ...Object.keys(metadata),                       // Get all enumerable property names
        ...Object.getOwnPropertySymbols(metadata)       // Get all symbols directly on metadata
    ];

    return metadataKeys.map(key => [key, metadata[key as keyof Metadata]]);
}