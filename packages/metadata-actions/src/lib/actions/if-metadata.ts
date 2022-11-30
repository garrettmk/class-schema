import { MaybeArray } from "@garrettmk/ts-utils";
import { applyActions } from "../apply-actions";
import { MetadataAction, MetadataSelector, MetadataTypeGuard } from "../types";

/**
 * Applies the given actions if the selector/type guard returns true.
 * 
 * @param typeGuard 
 * @param thenActions 
 * @param elseActions 
 */
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