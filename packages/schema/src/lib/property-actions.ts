import { PropertyAction } from "metadata-rules";
import { FieldMetadata, TargetContext, TypeFn } from "./class-schema-types";
import { ensureArray } from "metadata-rules";
import { MaybeArray } from "metadata-rules";



export function decorateProperty<PropertyMetadata, Context extends TargetContext>(...decorators: PropertyDecorator[]): PropertyAction<PropertyMetadata, Context> {
    return function (propertyMetadata, propertyKey, context) {
        const { target } = context;

        decorators.forEach(decorator => decorator(target as object, propertyKey));
    }
}

export type DecoratorsFn<PropertyMetadata, Context extends TargetContext> = (metadata: PropertyMetadata, propertyKey: PropertyKey, context: Context) => MaybeArray<PropertyDecorator>

export function decoratePropertyWith<PropertyMetadata, Context extends TargetContext>(decoratorsFn: DecoratorsFn<PropertyMetadata, Context>): PropertyAction<PropertyMetadata, Context> {
    return function (propertyMetadata, propertyKey, context) {
        const { target } = context;
        const decorators = ensureArray(decoratorsFn(propertyMetadata, propertyKey, context));

        decorators.forEach(decorator => decorator(target as object, propertyKey));
    }
}


export function setPropertyFaker<PropertyMetadata extends FieldMetadata, Context extends TargetContext>(fakerFn: TypeFn): PropertyAction<PropertyMetadata, Context> {
    return function (propertyMetadata, propertyKey, context) {
        return {
            ...propertyMetadata,
            faker: fakerFn
        };
    }
}