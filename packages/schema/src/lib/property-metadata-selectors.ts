import { PropertyKey } from "metadata-manager";
import { PropertySelector } from "metadata-rules";
import { Constructor } from "common";
import { PropertyMetadata } from "./property-metadata-types";
import { getTypeInfo } from "./util/get-type-info";


export function typeExtends<Metadata extends PropertyMetadata>(...types: Constructor[]): PropertySelector<Metadata> {
    return function (metadata) {
        const propertyType = getTypeInfo(metadata.type).type as Constructor;

        return types.some(type => propertyType === type || (propertyType?.prototype instanceof type))
    }
}


export function innerTypeExtends<Metadata extends PropertyMetadata>(...types: Constructor[]): PropertySelector<Metadata> {
    return function (metadata) {
        const propertyType = getTypeInfo(metadata.type).innerType as Constructor;

        return types.some(type => propertyType === type || (propertyType?.prototype instanceof type))
    }
}


export function typeMatches<Metadata extends PropertyMetadata>(...types: Constructor[]): PropertySelector<Metadata> {
    return function (metadata) {
        const propertyType = getTypeInfo(metadata.type).type;

        return types.some(type => propertyType === type);
    }
}


export function innerTypeMatches<Metadata extends PropertyMetadata>(...types: Constructor[]): PropertySelector<Metadata> {
    return function (metadata) {
        const innerPropertyType = getTypeInfo(metadata.type).innerType;

        return types.some(type => innerPropertyType === type);
    }
}


export function isArrayField<Metadata extends PropertyMetadata>(): PropertySelector<Metadata> {
    return function (metadata) {
        const { isArray } = getTypeInfo(metadata.type);
        return isArray;
    }
}


export function isConstructorField<Metadata extends PropertyMetadata>(): PropertySelector<Metadata> {
    return function (metadata) {
        const { innerType } = getTypeInfo(metadata.type);
        return typeof innerType === 'function' && Boolean(Object.getPrototypeOf(innerType));
    }
}

export function isOptionalField<Metadata extends PropertyMetadata>(): PropertySelector<Metadata> {
    return function (metadata) {
        const { optional } = metadata;
        return Boolean(optional);
    }
}

export function hasKeys<Metadata extends PropertyMetadata>(...keys: PropertyKey[]): PropertySelector<Metadata> {
    return function (metadata) {
        return keys.every(key => key in metadata);
    };
}


export function hasAnyKeys<Metadata extends PropertyMetadata>(...keys: PropertyKey[]): PropertySelector<Metadata> {
    return function (metadata) {
        return keys.some(key => key in metadata);
    };
}

export function propertyMetadataMatches<Metadata extends PropertyMetadata, Context = unknown>(match: Partial<Metadata>): PropertySelector<Metadata, Context> {
    return function (field): boolean {
        return Object.entries(match).every(
            ([key, value]) => field[key as keyof Metadata] === value
        );
    }
}

export function isFakerUnset<Metadata extends PropertyMetadata, Context = unknown>(): PropertySelector<Metadata, Context> {
    return function (metadata) {
        return metadata.faker === undefined;
    }
}