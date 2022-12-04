import { PropertyMetadata } from "./property-metadata-types";
import { MaybeArray, ensureArray } from "@garrettmk/ts-utils";
import { MetadataAction, applyActionsToProperties } from "@garrettmk/metadata-actions";
import { MetadataKey } from "@garrettmk/metadata-manager";
import { ClassMetadata, ClassContext } from "../class-metadata/class-metadata-manager";
import { PropertiesMetadataManager } from "../properties-metadata/properties-metadata-manager";

export interface ClassPropertyContext extends ClassContext {
    propertyKey: MetadataKey
  }

export type PropertyMetadataAction = MetadataAction<PropertyMetadata, ClassPropertyContext>;
  

export type DecoratorsFn<
  Metadata extends PropertyMetadata,
  Context extends ClassPropertyContext
> = (metadata: Metadata, context: Context) => MaybeArray<PropertyDecorator>;

export function decoratePropertyWith<
  Metadata extends PropertyMetadata,
  Context extends ClassPropertyContext
>(
  decoratorsFn: DecoratorsFn<Metadata, Context>
): MetadataAction<Metadata, Context> {
  return function (propertyMetadata, context) {
    const { target, propertyKey } = context;
    const decorators = ensureArray(decoratorsFn(propertyMetadata, context));

    decorators.forEach((decorator) => decorator(target.prototype, propertyKey));
  };
}


export function applyActionsToPropertyMetadata(
  actions: PropertyMetadataAction[]
): MetadataAction<ClassMetadata, ClassContext> {
  return function (classMetadata, context) {
    const { target } = context;
    const propertiesMetadata = PropertiesMetadataManager.getMetadata(target);

    const result = applyActionsToProperties(propertiesMetadata, context, actions);
    PropertiesMetadataManager.setMetadata(target, result);
  };
}