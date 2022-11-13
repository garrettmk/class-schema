import { PropertyKey } from "@/metadata-manager";
import { ensureArray, MaybeArray } from "@/util";


export type MetadataTransform<Metadata, Context = unknown> =
  (metadata: Metadata, context: Context) => Metadata | void;

export type PropertyTransform<Metadata, Context = unknown> = 
  (metadata: Metadata, propertyKey: PropertyKey, context: Context) => Metadata | void;


export function applyTransforms<Metadata, Context = unknown>(metadata: Metadata, context: Context, transforms: MaybeArray<MetadataTransform<Metadata, Context>>): Metadata {
  return ensureArray(transforms).reduce(
    (result, transform) => transform(result, context) ?? result,
    metadata
  ) ?? metadata;
}

export function applyPropertyTransforms<Metadata, Context = unknown>(metadata: Metadata, propertyKey: PropertyKey, context: Context, transforms: MaybeArray<PropertyTransform<Metadata, Context>>): Metadata {
  return ensureArray(transforms).reduce(
    (result, transform) => transform(result, propertyKey, context) ?? result,
    metadata
  ) ?? metadata;
}


export function ifMetadataType<Metadata, Subtype extends Metadata, Context = unknown>(
  predicate: (metadata: Metadata, context: Context) => metadata is Subtype,
  thenTransforms: MaybeArray<MetadataTransform<Metadata, Context>>,
  elseTransforms?: MaybeArray<MetadataTransform<Metadata, Context>>
): MetadataTransform<Metadata, Context> {
  return function (metadata, context) {
    if (predicate(metadata, context))
      return applyTransforms(metadata, context, thenTransforms);
    else if (elseTransforms)
      return applyTransforms(metadata, context, elseTransforms);

    return;
  }
}

export type IfPropertyPredicate<Metadata, Subtype extends Metadata = Metadata, Context = unknown> =
  (metadata: Metadata, propertyKey: PropertyKey, context: Context) => metadata is Subtype;

export function ifProperty<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(
  predicate: IfPropertyPredicate<Metadata, Subtype, Context>,
  thenTransforms: MaybeArray<PropertyTransform<Subtype, Context>>,
  elseTransforms?: MaybeArray<PropertyTransform<Metadata, Context>>
): PropertyTransform<Metadata, Context> {
  return function (metadata, propertyKey, context) {
    if (predicate(metadata, propertyKey, context))
      return applyPropertyTransforms(metadata, propertyKey, context, thenTransforms);
    else if (elseTransforms)
      return applyPropertyTransforms(metadata, propertyKey, context, elseTransforms);

    return;
  }
}