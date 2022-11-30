import { mapMetadataProperties, MetadataDict, MetadataKey } from '@garrettmk/metadata-manager';
import { MaybeArray, Values } from '@garrettmk/ts-utils';
import { PropertyContext } from '../metadata-actions';
import type { MetadataAction } from '../types';
import { apply } from './apply';

/**
 *
 * @param actions A `MetadataAction` or an array of `MetadataActions`
 * @returns A `MetadataAction` that applies the given actions to each property
 *          in the metadata and returns the result.
 */
export function applyToProperties<Metadata extends MetadataDict, Context>(
  actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>
): MetadataAction<Metadata, Context> {
  return (metadata: Metadata, context: Context) => mapMetadataProperties(metadata, (propertyMeta, propertyKey) => {
    return apply(actions)(propertyMeta, { ...context, propertyKey: propertyKey as MetadataKey }) ?? propertyMeta;
  });
}
