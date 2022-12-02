import { applyActions, applyActionsToProperties, MetadataAction } from '@garrettmk/metadata-actions';
import { ensureArray, MaybeArray } from '@garrettmk/ts-utils';
import { mapValues, omit, pick } from 'radash';
import { ClassContext, ClassMetadata, PropertyMetadataAction, ClassPropertyContext, PropertiesMetadata, PropertiesMetadataManager, PropertyMetadata } from './class-schema-types';
import { MetadataDict, MetadataKey } from '@garrettmk/metadata-manager';


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


export function makePropertiesOptional(...keys: MetadataKey[]): MetadataAction<PropertiesMetadata> {
  return function (metadata) {
    return mapValues(metadata, (propertyMeta, propertyKey) => {
      return {
        ...propertyMeta,
        optional: !keys.length || keys.includes(propertyKey)
      }
    });
  }
}

export function makePropertiesRequired(...keys: MetadataKey[]): MetadataAction<PropertiesMetadata> {
  return function (metadata) {
    return mapValues(metadata, (propertyMeta, propertyKey) => {
      return {
        ...propertyMeta,
        optional: !( !keys.length || keys.includes(propertyKey) )
      }
    })
  }
}

export function omitProperties(...keys: MetadataKey[]): MetadataAction<PropertiesMetadata> {
  return function (metadata) {
    return omit(metadata, keys);
  }
}

export function pickProperties(...keys: MetadataKey[]): MetadataAction<PropertiesMetadata> {
  return function (metadata) {
    return pick(metadata, keys);
  }
}


export function withMetadata<Metadata extends MetadataDict, Context>(metadataOrFn: Metadata | (() => Metadata), actions: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context> {
  return function (_metadata, context) {
    const metadata = typeof metadataOrFn === 'function'
      ? metadataOrFn()
      : metadataOrFn;

    return applyActions(metadata, context, actions);
  }
}