import { MaybeArray } from 'util';
import { MetadataAction, applyActions } from './metadata-actions';

export type MetadataSelector<Metadata, Context = unknown> = (
  metadata: Metadata,
  context: Context
) => unknown;

export function ifMetadata<Metadata, Context = unknown>(
  selector: MetadataSelector<Metadata, Context>,
  thenActions: MaybeArray<MetadataAction<Metadata, Context>>,
  elseActions?: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const actions = selector(metadata, context) ? thenActions : elseActions;
    if (actions) return applyActions(metadata, context, actions);

    return metadata;
  };
}

export function ifMetadataType<
  Metadata,
  Subtype extends Metadata,
  Context = unknown
>(
  predicate: (metadata: Metadata, context: Context) => metadata is Subtype,
  thenActions: MaybeArray<MetadataAction<Subtype, Context>>,
  elseActions?: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    if (predicate(metadata, context))
      return applyActions(metadata, context, thenActions);
    else if (elseActions) return applyActions(metadata, context, elseActions);

    return metadata;
  };
}

export function and<Params>(
  ...conditions: ((...params: Params[]) => unknown)[]
): (...params: Params[]) => unknown {
  return function (...args: Params[]) {
    return conditions.every((condition) => condition(...args));
  };
}

export function or<Params>(
  ...conditions: ((...params: Params[]) => unknown)[]
): (...params: Params[]) => unknown {
  return function (...args: Params[]) {
    return conditions.some((condition) => condition(...args));
  };
}

export function not<Params>(
  condition: (...params: Params[]) => unknown
): (...params: Params[]) => unknown {
  return function (...args: Params[]) {
    return !condition(...args);
  };
}
