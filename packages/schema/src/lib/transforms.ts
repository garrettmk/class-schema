import { ifProperty, IfPropertyPredicate, PropertyTransform } from 'metadata-transforms';
import { PropertyDecorator, PropertyKey } from 'metadata-manager';
import { BooleanFieldMetadata, PropertyMetadata, PrototypeTargetContext } from './property-metadata-types';
import { getTypeInfo } from './util/get-type-info';
import { Constructor, ensureArray, MaybeArray, merge } from 'common';
import { Equals, IsArray, IsBoolean, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength, NotEquals } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeFn } from './util/types';
import { booleanFieldFaker, stringFieldFaker } from './util/property-fakers';


export type PropertySelector<Metadata, Context = unknown> =
    (metadata: Metadata, propertyKey: PropertyKey, context: Context) => unknown;

export type PropertyDecoratorFn<Metadata, Context = unknown> =
    (metadata: Metadata, propertyKey: PropertyKey, context: Context) => PropertyDecorator;

export type PropertyDecoratorMap<Metadata, Context = unknown> = 
    [PropertySelector<Metadata, Context>, PropertyDecoratorFn<Metadata, Context>];

export function selectPropertyDecorators<Metadata, Context extends PrototypeTargetContext = PrototypeTargetContext>(mappings: PropertyDecoratorMap<Metadata, Context>[]): PropertyTransform<Metadata, Context> {
    return function (metadata, propertyKey, context) {
        const { target } = context;

        mappings
            .filter(([predicate]) => predicate(metadata, propertyKey, context))
            .map(([_, decoratorFn]) => decoratorFn(metadata, propertyKey, context))
            .forEach(decorator => decorator(target, propertyKey));
    }
}

export function decorateProperty<Metadata, Context extends PrototypeTargetContext = PrototypeTargetContext>(decoratorsFn: (metadata: Metadata, propertyKey: PropertyKey, context: Context) => MaybeArray<PropertyDecorator>): PropertyTransform<Metadata, Context> {
    return function (metadata, propertyKey, context) {
        const decorators = decoratorsFn(metadata, propertyKey, context);
        ensureArray(decorators).forEach(decorator => decorator(context.target, propertyKey))
    }
}

export function updateProperty<Metadata extends PropertyMetadata, Context = unknown>(updateFn: (metadata: Metadata, propertyKey: PropertyKey, context: Context) => Partial<Metadata>): PropertyTransform<Metadata, Context> {
    return function (metadata, propertyKey, context) {
        const update = updateFn(metadata, propertyKey, context);
        return merge(metadata, update);
    }
}

export function useFieldFaker<Metadata extends PropertyMetadata, Context = unknown>(fieldFakerFn: (metadata: Metadata) => TypeFn): PropertyTransform<Metadata, Context> {
    return function (metadata, propertyKey, context) {
        return merge(metadata, {
            faker: fieldFakerFn(metadata)
        });
    }
}

export function matchesType<T, Context = unknown>(type: T) {
    return function(metadata: PropertyMetadata, propertyKey: PropertyKey, context: Context): metadata is PropertyMetadata<T> {
        return getTypeInfo(metadata.type).type === type;
    }
}

export function isBooleanMetadata(metadata: PropertyMetadata): metadata is BooleanFieldMetadata {
    return getTypeInfo(metadata.type).innerType === Boolean;
}

export function isArray(metadata: PropertyMetadata): metadata is PropertyMetadata<unknown[]> {
    return getTypeInfo(metadata.type).isArray;
}

export function isOptional(metadata: PropertyMetadata): metadata is (PropertyMetadata & { optional: true }) {
    return Boolean(metadata.optional);
}

export function isClassConstructor(metadata: PropertyMetadata): metadata is PropertyMetadata {
    const { type } = getTypeInfo(metadata.type);
    const excluded = [String, Number, Boolean, Date];

    return 'prototype' in type && typeof type === 'function' && !excluded.includes(type);
}

export function hasNoFaker<Metadata extends PropertyMetadata>(metadata: Metadata): metadata is Metadata {
    return !('faker' in metadata);
}

export function hasKeys<Metadata extends PropertyMetadata, Context = unknown>(...keys: (keyof Metadata)[]) {
    return function (metadata: Metadata): metadata is Metadata {
        return keys.every(key => key in metadata);
    }
}

export function matchesFragment<Metadata extends PropertyMetadata, Subtype extends Partial<Metadata>>(fragment: Subtype) {
    return function (metadata: Metadata): metadata is Metadata & Subtype {
        return Object.entries(fragment).every(
            ([key, value]) => metadata[key as keyof typeof metadata] === value
        )
    }
}

export const booleanFieldTransform = ifProperty(isBooleanMetadata, [
    decorateProperty(metadata => IsBoolean({
        each: getTypeInfo(metadata.type).isArray
    })),
]);

export const transforms: PropertyTransform<PropertyMetadata, PrototypeTargetContext>[] = [
    selectPropertyDecorators([
        [isOptional, () => IsOptional()],
        [isArray, () => IsArray()],
    ]),

    ifProperty(isClassConstructor, decorateProperty(meta => Type(() => getTypeInfo(meta.type).innerType as Constructor))),

    // Boolean fields

    ifProperty(matchesType(Boolean), [
        decorateProperty(meta => IsBoolean({
            each: getTypeInfo(meta.type).isArray
        })),

        ifProperty(hasNoFaker, [
            useFieldFaker(booleanFieldFaker)
        ]),

        ifProperty(hasKeys('eq'), [
            decorateProperty(({ eq, type }) => Equals(eq, {
                each: getTypeInfo(type).isArray
            }))
        ]),

        ifProperty(hasKeys('ne'), [
            decorateProperty(meta => NotEquals(meta.ne, {
                each: getTypeInfo(meta.type).isArray
            }))
        ]),
    ]),

    // String fields

    ifProperty(matchesType(String), [
        decorateProperty(meta => IsString({
            each: getTypeInfo(meta.type).isArray
        })),

        ifProperty(hasNoFaker, [
            useFieldFaker(stringFieldFaker)
        ]),

        ifProperty(hasKeys('minLength'), [
            decorateProperty(({ type, minLength }) => MinLength(minLength!, {
                each: getTypeInfo(type).isArray
            }))
        ]),

        ifProperty(hasKeys('maxLength'), [
            decorateProperty(({ type, maxLength }) => MaxLength(maxLength!, {
                each: getTypeInfo(type).isArray
            }))
        ]),

        ifProperty(hasKeys('in'), [
            decorateProperty(({ type, in: _in }) => IsIn(_in!, {
                each: getTypeInfo(type).isArray
            }))
        ]),

        ifProperty(hasKeys('regex'), [
            decorateProperty(({ type, regex }) => Matches(regex!, {
                each: getTypeInfo(type).isArray
            }))
        ])
    ])
]