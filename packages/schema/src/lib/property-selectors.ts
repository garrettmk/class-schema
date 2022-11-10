import { Constructor, PropertyKey } from "metadata-manager";
import { PropertySelector } from "metadata-rules";
import { FieldMetadata } from "./class-schema-types";
import { getTypeInfo } from "./util/get-type-info";


export function typeExtends<PropertyMetadata extends FieldMetadata>(...types: Constructor[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const propertyType = getTypeInfo(metadata.type).type as Constructor;

        return types.some(type => propertyType === type || (propertyType?.prototype instanceof type))
    }
}


export function innerTypeExtends<PropertyMetadata extends FieldMetadata>(...types: Constructor[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const propertyType = getTypeInfo(metadata.type).innerType as Constructor;

        return types.some(type => propertyType === type || (propertyType?.prototype instanceof type))
    }
}


export function typeMatches<PropertyMetadata extends FieldMetadata>(...types: Constructor[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const propertyType = getTypeInfo(metadata.type).type;

        return types.some(type => propertyType === type);
    }
}


export function innerTypeMatches<PropertyMetadata extends FieldMetadata>(...types: Constructor[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const innerPropertyType = getTypeInfo(metadata.type).innerType;

        return types.some(type => innerPropertyType === type);
    }
}


export function isArrayField<PropertyMetadata extends FieldMetadata>(): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const { isArray } = getTypeInfo(metadata.type);
        return isArray;
    }
}


export function isConstructorField<PropertyMetadata extends FieldMetadata>(): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const { innerType } = getTypeInfo(metadata.type);
        return typeof innerType === 'function' && Boolean(Object.getPrototypeOf(innerType));
    }
}

export function isOptionalField<PropertyMetadata extends FieldMetadata>(): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        const { optional } = metadata;
        return Boolean(optional);
    }
}

export function hasKeys<PropertyMetadata extends FieldMetadata>(...keys: PropertyKey[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        return keys.every(key => key in metadata);
    };
}


export function hasAnyKeys<PropertyMetadata extends FieldMetadata>(...keys: PropertyKey[]): PropertySelector<PropertyMetadata> {
    return function (metadata, propertyKey, context) {
        return keys.some(key => key in metadata);
    };
}

export function propertyMetadataMatches<PropertyMetadata extends FieldMetadata, Context = unknown>(match: Partial<PropertyMetadata>): PropertySelector<PropertyMetadata, Context> {
    return function (field): boolean {
        return Object.entries(match).every(
            ([key, value]) => field[key as keyof PropertyMetadata] === value
        );
    }
}

export function isFakerUnset<PropertyMetadata extends FieldMetadata, Context = unknown>(): PropertySelector<PropertyMetadata, Context> {
    return function (metadata, propertyKey, context) {
        return metadata.faker === undefined;
    }
}