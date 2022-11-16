import { ensureArray, MaybeArray, Values } from 'common';
import { PropertyKey } from 'metadata-manager';
import { MetadataSelector, MetadataTypeGuard } from './metadata-selectors';


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

export type MetadataPropertyAction<Metadata extends object, Context extends object> = MetadataAction<Values<Metadata>, Context & PropertyContext>

export function applyActionsToProperties<Metadata extends object, Context extends object>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataPropertyAction<Metadata, Context>>): Metadata {
  return Object.entries(metadata).reduce(
    (result, [propertyKey, property]) => {
      const propertyContext: Context & PropertyContext = { ...context, propertyKey };
      const propertyResult = applyActions(property, propertyContext, actions);

      result[propertyKey as keyof Metadata] = propertyResult;
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