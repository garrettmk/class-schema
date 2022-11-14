import { PropertyKey } from 'metadata-manager';
import { ensureArray, MaybeArray } from 'common';

export type PropertyAction<Metadata, Context = unknown> = (
  metadata: Metadata,
  propertyKey: PropertyKey,
  context: Context
) => Metadata | void;

// export function applyPropertyActions<Metadata extends object, Context = unknown>(metadata: Metadata, context: Context, actions: MaybeArray<PropertyAction<Values<Metadata>, Context>>): Metadata {
//     return Object.entries(metadata).reduce(
//         (result, [propertyKey, propertyMetadata]) => {
//             result[propertyKey as keyof Metadata] = ensureArray(actions).reduce(
//                 (propertyResult, action) => action(propertyMetadata, propertyKey, context) ?? propertyResult,
//                 propertyMetadata
//             ) ?? propertyMetadata;
//             return result;
//         },
//         metadata
//     ) ?? metadata;
// }

export function applyPropertyActions<Metadata, Context = unknown>(
  metadata: Metadata,
  propertyKey: PropertyKey,
  context: Context,
  actions: MaybeArray<PropertyAction<Metadata, Context>>
): Metadata {
  return (
    ensureArray(actions).reduce(
      (result, action) => action(result, propertyKey, context) ?? result,
      metadata
    ) ?? metadata
  );
}
