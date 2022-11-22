import { Values } from "./types";

export function entries<Metadata extends object>(metadata: Metadata): [string | symbol, Values<Metadata>][] {
    const propertyKeys = [
        ...Object.keys(metadata),                       // Get all enumerable property names
        ...Object.getOwnPropertySymbols(metadata)       // Get all symbols directly on metadata
    ];

    return propertyKeys.map(key => [key, metadata[key as keyof Metadata]]);
}