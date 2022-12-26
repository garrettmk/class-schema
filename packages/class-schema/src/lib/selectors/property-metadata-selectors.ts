import { MetadataSelector, MetadataTypeGuard, PropertyContext } from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { Id } from '../custom-types/id';
import { PropertyMetadata } from '../types';
import { getTypeInfo } from '../util/get-type-info';
import { Enum } from '../util/types';


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

export function isEnumField(metadata: PropertyMetadata): metadata is PropertyMetadata<Enum | Enum[]> {
  const { innerType } = getTypeInfo(metadata.type);
  return typeof innerType === 'object';
}

export function isBuiltInField<Context>(metadata: PropertyMetadata, context: Context): metadata is PropertyMetadata<StringConstructor> {
  return innerTypeMatches(String, Number, Boolean, Date)(metadata, context);
}

export function extendsBuiltInField<Context>(metadata: PropertyMetadata, context: Context): boolean {
  return innerTypeExtends(String, Number, Boolean, Date)(metadata, context);
}

export function isPrimaryKeyField<Context>(metadata: PropertyMetadata, context: Context): metadata is PropertyMetadata<Id> {
  return 'primaryKey' in metadata && !!(metadata as any).primaryKey;
}

export function typeMatches<Type extends Constructor>(type: Type): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>>;
export function typeMatches(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata>;
export function typeMatches<Type extends Constructor>(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>> {
  return function (metadata): metadata is PropertyMetadata<Type> {
    const { type } = getTypeInfo(metadata.type);
    return types.some(t => type === t);
  };
}

export function typeExtends<Type extends Constructor>(type: Type): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>>;
export function typeExtends(...types: Constructor[]):  MetadataTypeGuard<PropertyMetadata, PropertyMetadata>;
export function typeExtends<Type extends Constructor>(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>> {
  return function (metadata): metadata is PropertyMetadata<Type> {
    const type = getTypeInfo(metadata.type).type as Constructor;

    return types.some(t => type === t || type.prototype instanceof t);
  };
}

export function innerTypeMatches<Type extends Constructor>(type: Type): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>>;
export function innerTypeMatches(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata>;
export function innerTypeMatches<Type extends Constructor>(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type> | PropertyMetadata<Type[]>> {
  return function (metadata): metadata is PropertyMetadata<Type> | PropertyMetadata<Type[]> {
    const { innerType } = getTypeInfo(metadata.type);
    return types.some((type) => innerType === type);
  };
}

export function innerTypeExtends<Type extends Constructor>(type: Type): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type>>;
export function innerTypeExtends(...types: Constructor[]):  MetadataTypeGuard<PropertyMetadata, PropertyMetadata>;
export function innerTypeExtends<Type extends Constructor>(...types: Constructor[]): MetadataTypeGuard<PropertyMetadata, PropertyMetadata<Type> | PropertyMetadata<Type[]>> {
  return function (metadata): metadata is PropertyMetadata<Type> | PropertyMetadata<Type[]> {
    const fieldType = getTypeInfo(metadata.type).innerType as Constructor;
    return types.some(t => fieldType === t || fieldType.prototype instanceof t);
  };
}

export function matchesPropertyKey<K>(...keys: K[]): MetadataSelector<any, PropertyContext> {
  return function (_, context): boolean {
    return keys.some(key => context.propertyKey === key);
  }
}