import { applyActions, MetadataAction } from '@garrettmk/metadata-actions';
import { MetadataDict, MetadataKey } from '@garrettmk/metadata-manager';
import { MaybeArray } from '@garrettmk/ts-utils';
import { mapValues, omit, pick } from 'radash';
import { PropertiesMetadataManager } from '../managers/properties-metadata-manager';
import { ClassContext, PropertiesMetadata } from '../types';


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


export function withPropertiesMetadata<Metadata, Context extends ClassContext>(actions: MaybeArray<MetadataAction<PropertiesMetadata, Context>>): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const { target } = context;
    const propertiesMetadata = PropertiesMetadataManager.getMetadata(target);

    applyActions(propertiesMetadata, context, actions);

    return metadata;
  }
}