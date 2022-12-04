import { MetadataSelector, MetadataTypeGuard, PropertyContext } from '@garrettmk/metadata-actions';
import { AnyConstructor, Constructor, doesExtend } from '@garrettmk/ts-utils';
import { Id } from '../custom-types/id';
import { getTypeInfo } from '../util/get-type-info';
import { BuiltInConstructor, Enum } from '../util/types';
import { PropertyMetadata } from './property-metadata-types';


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
  metadata: PropertyMetadata,
  context: void
): metadata is PropertyMetadata<Constructor> {
  const { innerType } = getTypeInfo(metadata.type);
  return (
    typeof innerType === 'function' && Boolean(Object.getPrototypeOf(innerType))
  );
}

export function isEnumField(metadata: PropertyMetadata): metadata is PropertyMetadata<Enum> {
  const { innerType } = getTypeInfo(metadata.type);
  return typeof innerType === 'object';
}

export function isBuiltInField<Context>(metadata: PropertyMetadata, context: Context): metadata is PropertyMetadata<StringConstructor> {
  const { innerType } = getTypeInfo(metadata.type);
  const builtIns: unknown[] = [String, Number, Boolean, Date];

  return builtIns.includes(innerType);
}

export function isPrimaryKeyField<Context>(metadata: PropertyMetadata, context: Context): metadata is PropertyMetadata<Id> {
  return 'primaryKey' in metadata && !!metadata['primaryKey'];
}


export function typeMatches<Type extends Constructor>(
  type: Type
): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>> {
  return function (metadata): metadata is PropertyMetadata<Type> {
    return getTypeInfo(metadata.type).type === type;
  };
}

export function typeExtends<Type extends AnyConstructor>(
  type: Type
): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>, void> {
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

export function innerTypeExtends<Type extends AnyConstructor>(
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

export function matchesPropertyKey<K>(...keys: K[]): MetadataSelector<any, PropertyContext> {
  return function (_, context): boolean {
    return keys.some(key => context.propertyKey === key);
  }
}