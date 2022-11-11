import { PropertyAction } from "@/metadata-rules";
import { ensureArray, MaybeArray} from "@/util";
import { TypeFn } from "./util/types";
import { PrototypeTargetContext, PropertyMetadata } from "./property-metadata-types";


export function decorateProperty<Metadata extends PropertyMetadata, Context extends PrototypeTargetContext>(...decorators: PropertyDecorator[]): PropertyAction<Metadata, Context> {
    return function (propertyMetadata, propertyKey, context) {
        const { target } = context;

        decorators.forEach(decorator => decorator(target as object, propertyKey));
    }
}

export type DecoratorsFn<Metadata extends PropertyMetadata, Context extends PrototypeTargetContext> = 
    (metadata: Metadata, propertyKey: PropertyKey, context: Context) => MaybeArray<PropertyDecorator>

export function decoratePropertyWith<Metadata extends PropertyMetadata, Context extends PrototypeTargetContext>(decoratorsFn: DecoratorsFn<Metadata, Context>): PropertyAction<Metadata, Context> {
    return function (propertyMetadata, propertyKey, context) {
        const { target } = context;
        const decorators = ensureArray(decoratorsFn(propertyMetadata, propertyKey, context));

        decorators.forEach(decorator => decorator(target as object, propertyKey));
    }
}


export function setPropertyFaker<Metadata extends PropertyMetadata, Context extends PrototypeTargetContext>(fakerFn: TypeFn): PropertyAction<Metadata, Context> {
    return function (propertyMetadata) {
        return {
            ...propertyMetadata,
            faker: fakerFn
        };
    }
}