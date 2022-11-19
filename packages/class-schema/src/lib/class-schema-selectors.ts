import { Constructor } from './util/types';
import { MetadataTypeGuard, MetadataSelector } from '@garrettmk/metadata-actions';
import { PropertyMetadata, ClassMetadata, ClassContext, ObjectType } from './class-schema-types';
import { getTypeInfo } from './util/get-type-info';

export function isOptionalField(
  metadata: PropertyMetadata
): metadata is PropertyMetadata & { optional: true } {
  return Boolean(metadata.optional);
}

export function isArrayField(
  metadata: PropertyMetadata
): metadata is PropertyMetadata<unknown[]> {
  return getTypeInfo(metadata.type).isArray;
}

export function isConstructorField(
  metadata: PropertyMetadata
): metadata is PropertyMetadata<Constructor> {
  const { innerType } = getTypeInfo(metadata.type);
  return (
    typeof innerType === 'function' && Boolean(Object.getPrototypeOf(innerType))
  );
}

export function typeMatches<Type extends Constructor>(
  type: Type
): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>> {
  return function (metadata): metadata is PropertyMetadata<Type> {
    return getTypeInfo(metadata.type).type === type;
  };
}

export function typeExtends<Type extends Constructor>(
  type: Type
): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>> {
  return function (metadata): metadata is PropertyMetadata<Type> {
    const fieldType = getTypeInfo(metadata.type).type as Constructor;

    return fieldType === type || fieldType?.prototype instanceof type;
  };
}

export function innerTypeMatches<Type extends Constructor>(
  ...types: Type[]
): MetadataTypeGuard<
  PropertyMetadata,
  PropertyMetadata<Type> | PropertyMetadata<Type[]>
> {
  return function (
    metadata
  ): metadata is PropertyMetadata<Type> | PropertyMetadata<Type[]> {
    return types.some((type) => getTypeInfo(metadata.type).innerType === type);
  };
}

export function innerTypeExtends<Type extends Constructor>(
  type: Type
): MetadataTypeGuard<
  PropertyMetadata,
  PropertyMetadata<Type> | PropertyMetadata<Type[]>
> {
  return function (
    metadata
  ): metadata is PropertyMetadata<Type> | PropertyMetadata<Type[]> {
    const fieldType = getTypeInfo(metadata.type).innerType as Constructor;

    return fieldType === type || fieldType?.prototype instanceof type;
  };
}

export function isObjectType(
  type: ObjectType
): MetadataSelector<ClassMetadata, ClassContext> {
  return function (metadata) {
    return Boolean(metadata.objectTypes?.includes(type));
  };
}
