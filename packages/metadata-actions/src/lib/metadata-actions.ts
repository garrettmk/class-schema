import { MaybeArray, Values, ensureArray } from '@garrettmk/ts-utils';
import { MetadataSelector, MetadataTypeGuard } from './metadata-selectors';
import { PropertyKey } from './util/types';
import { entries } from './util/entries';
import { mapValues } from 'radash';


export type MetadataAction<Metadata, Context = unknown> = 
  (metadata: Metadata, context: Context) => Metadata | void;

export function applyActions<Metadata, Context = unknown>(actions: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context>;
export function applyActions<Metadata, Context = unknown>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Metadata, Context>>): Metadata;
export function applyActions<Metadata, Context = unknown>(...args: [MaybeArray<MetadataAction<Metadata, Context>>] | [Metadata, Context, MaybeArray<MetadataAction<Metadata, Context>>]): Metadata | MetadataAction<Metadata, Context> {
  if (args.length === 1) {
    const [actions] = args;

    return function (metadata, context) {
      return ensureArray(actions).reduce(
        (result, action) => action(result, context) ?? result,
        metadata
      ) ?? metadata;
    }
  } else {
    const [metadata, context, actions] = args;
    return applyActions(actions)(metadata, context) ?? metadata;
  }
}


export type PropertyContext = {
  propertyKey: PropertyKey
}

export function applyActionsToProperties<Metadata extends object, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>): Metadata;
export function applyActionsToProperties<Metadata extends object, Context>(actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>): MetadataAction<Metadata, Context>;
export function applyActionsToProperties<Metadata extends object, Context>(...args: [MaybeArray<MetadataAction<Values<Metadata>, Context>>] | [Metadata, Context, MaybeArray<MetadataAction<Values<Metadata>, Context>>]): Metadata | MetadataAction<Metadata, Context> {
  if (args.length === 1) {
    const [actions] = args;

    return function (metadata, context) {
      return entries(metadata).reduce(
        (result, [propertyKey, propertyMeta]) => {
          const propertyContext = { propertyKey, ...context };

          result[propertyKey as keyof Metadata] = applyActions(actions)(propertyMeta, propertyContext) ?? propertyMeta;

          return result;
        },
        metadata
      ) ?? metadata;
    }
  } else {
    const [metadata, context, actions] = args;

    return applyActionsToProperties(actions)(metadata, context) ?? metadata;
  }
}



export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(typeGuard: MetadataTypeGuard<Metadata, Subtype, Context>, thenActions: MaybeArray<MetadataAction<Subtype, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Context = unknown>(selector: MetadataSelector<Metadata, Context>, thenActions: MaybeArray<MetadataAction<Metadata, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(selectorOrTypeGuard: MetadataSelector<Metadata, Context> | MetadataTypeGuard<Metadata, Subtype, Context>, thenActions: MaybeArray<MetadataAction<Subtype, Context>>, elseActions?: MaybeArray<MetadataAction<Metadata, Context>>): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    if (selectorOrTypeGuard(metadata, context))
      return applyActions(thenActions)(metadata, context);
    else if (elseActions)
      return applyActions(elseActions)(metadata, context);

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