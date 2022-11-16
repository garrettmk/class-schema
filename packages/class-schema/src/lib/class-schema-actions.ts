import {
  ClassPropertyAction,
  PropertiesMetadataManager,
  ClassMetadata,
  ClassContext,
  PropertyMetadata,
  PropertyContext,
} from './class-schema-types';
import { MetadataAction, applyActions } from 'metadata-actions';
import { MaybeArray, ensureArray } from 'common';

export function decorateClass<Metadata, Context extends ClassContext>(
  ...decorators: ClassDecorator[]
): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const { target } = context;

    decorators.forEach((decorator) => decorator(target));
  };
}

export type DecorateClassWithFn<Metadata, Context extends ClassContext> = (
  metadata: Metadata,
  context: Context
) => MaybeArray<ClassDecorator>;

export function decorateClassWith<Metadata, Context extends ClassContext>(
  decoratorsFn: DecorateClassWithFn<Metadata, Context>
): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const { target } = context;
    const decorators = ensureArray(decoratorsFn(metadata, context));

    decorators.forEach((decorator) => decorator(target));
  };
}

export function decorateProperty<
  Metadata extends PropertyMetadata,
  Context extends PropertyContext
>(...decorators: PropertyDecorator[]): MetadataAction<Metadata, Context> {
  return function (propertyMetadata, context) {
    const { target, propertyKey } = context;

    decorators.forEach((decorator) => decorator(target as object, propertyKey));
  };
}

export type DecoratorsFn<
  Metadata extends PropertyMetadata,
  Context extends PropertyContext
> = (metadata: Metadata, context: Context) => MaybeArray<PropertyDecorator>;

export function decoratePropertyWith<
  Metadata extends PropertyMetadata,
  Context extends PropertyContext
>(
  decoratorsFn: DecoratorsFn<Metadata, Context>
): MetadataAction<Metadata, Context> {
  return function (propertyMetadata, context) {
    const { target, propertyKey } = context;
    const decorators = ensureArray(decoratorsFn(propertyMetadata, context));

    decorators.forEach((decorator) => decorator(target, propertyKey));
  };
}

export function applyPropertyActions(
  actions: ClassPropertyAction[]
): MetadataAction<ClassMetadata, ClassContext> {
  return function (metadata, context) {
    const { target } = context;
    const propertiesMetadata = PropertiesMetadataManager.getMetadata(
      target.prototype
    );

    const result =
      Object.entries(propertiesMetadata).reduce(
        (result, [propertyKey, propertyMetadata]) => {
          const propertyContext: PropertyContext = { ...context, propertyKey };

          result[propertyKey] = applyActions(
            propertyMetadata,
            propertyContext,
            actions
          );

          return result;
        },
        propertiesMetadata
      ) ?? propertiesMetadata;

    PropertiesMetadataManager.setMetadata(target.prototype, result);
  };
}