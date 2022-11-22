import { MetadataSelector, MetadataTypeGuard } from './metadata-selectors';
import { PropertyKey, MaybeArray, Values } from './util/types';
import { ensureArray } from './util/ensure-array';
import { entries } from './util/entries';


export type MetadataAction<Metadata, Context = unknown> = 
  (metadata: Metadata, context: Context) => Metadata | void;

export function applyActions<Metadata, Context = unknown>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Metadata, Context>>): Metadata {
  return ensureArray(actions).reduce(
    (result, action) => action(result, context) ?? result,
    metadata
  ) ?? metadata;
}


export type PropertyContext = {
  propertyKey: PropertyKey
}

export function applyActionsToProperties<Metadata extends object, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>): Metadata {
  return entries(metadata).reduce(
    (result, [propertyKey, propertyMeta]) => {
      const propertyContext = { propertyKey, ...context };

      result[propertyKey as keyof Metadata] = applyActions(propertyMeta, propertyContext, actions);

      return result;
    },
    metadata
  ) ?? metadata;
}



export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(typeGuard: MetadataTypeGuard<Metadata, Subtype, Context>, thenActions: MaybeArray<MetadataAction<Subtype, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Context = unknown>(selector: MetadataSelector<Metadata, Context>, thenActions: MaybeArray<MetadataAction<Metadata, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(selectorOrTypeGuard: MetadataSelector<Metadata, Context> | MetadataTypeGuard<Metadata, Subtype, Context>, thenActions: MaybeArray<MetadataAction<Subtype, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    if (selectorOrTypeGuard(metadata, context))
      return applyActions(metadata, context, thenActions);
    else if (elseActions)
      return applyActions(metadata, context, elseActions);

    return metadata;
  }
}


export type UpdateMetadataFn<Metadata, Context = unknown> = (metadata: Metadata, context: Context) => Partial<Metadata>

export function updateMetadata<Metadata, Context = unknown>(updateFn: UpdateMetadataFn<Metadata, Context>): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const update = updateFn(metadata, context);
    
    return { ...metadata, ...update };
  }
}