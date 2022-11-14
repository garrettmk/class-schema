import { PropertyKey } from 'metadata-manager';
import { MaybeArray } from 'util';
import { PropertyAction, applyPropertyActions } from './property-actions';


export type PropertySelector<Metadata, Context = unknown> = (
  metadata: Metadata,
  propertyKey: PropertyKey,
  context: Context
) => unknown;


export function ifProperty<Metadata, Context = unknown>(
  selector: PropertySelector<Metadata, Context>,
  thenActions: MaybeArray<PropertyAction<Metadata, Context>>,
  elseActions?: MaybeArray<PropertyAction<Metadata, Context>>
): PropertyAction<Metadata, Context> {
  return function (metadata, propertyKey, context) {
    if (selector(metadata, propertyKey, context))
      return applyPropertyActions(metadata, propertyKey, context, thenActions);
    else if (elseActions)
      return applyPropertyActions(metadata, propertyKey, context, elseActions);

    return metadata;
  };
}


export function ifPropertyType<
  Metadata,
  Subtype extends Metadata,
  Context = unknown
>(
  predicate: (
    metadata: Metadata,
    propertyKey: PropertyKey,
    context: Context
  ) => metadata is Subtype,
  thenActions: MaybeArray<PropertyAction<Subtype, Context>>,
  elseActions?: MaybeArray<PropertyAction<Metadata, Context>>
): PropertyAction<Metadata, Context> {
  return function (metadata, propertyKey, context) {
    if (predicate(metadata, propertyKey, context))
      return applyPropertyActions(metadata, propertyKey, context, thenActions);
    else if (elseActions)
      return applyPropertyActions(metadata, propertyKey, context, elseActions);

    return metadata;
  };
}
