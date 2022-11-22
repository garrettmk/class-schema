
export function entries<Metadata extends Record<string | symbol, unknown>>(metadata: Metadata): [keyof Metadata, Metadata[keyof Metadata]][] {
    const propertyKeys: (keyof Metadata)[] = [
        ...Object.keys(metadata),                       // Get all enumerable property names
        ...Object.getOwnPropertySymbols(metadata)       // Get all symbols directly on metadata
    ];

    return propertyKeys.map(key => [key, metadata[key]] as [keyof Metadata, Metadata[keyof Metadata]]);
}