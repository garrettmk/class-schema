import { InnerType, TypeFn } from './types';

export type TypeFnInfo<T> = {
  type: T
  innerType: InnerType<T>
  isArray: boolean
  isConstructor: boolean
  isEnum: boolean
}

export function getTypeInfo<T>(typeFn: TypeFn<T>): TypeFnInfo<T> {
  const type = typeFn();
  const innerType = Array.isArray(type) ? type[0] : type;
  const isArray = innerType !== type;
  const isConstructor = typeof innerType === 'function' && 'prototype' in innerType;
  const isEnum = !isConstructor && 
                  typeof innerType === 'object' &&
                  Object.values(innerType).every(v => typeof v === 'string') || 
                  Object.values(innerType).every(v => typeof v === 'number');

  return {
    type,
    innerType,
    isArray,
    isConstructor,
    isEnum,
  };
}
