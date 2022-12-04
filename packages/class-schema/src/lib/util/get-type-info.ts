import { TypeFn } from './types';

export type TypeFnInfo<T> = {
  type: T | T[]
  innerType: T
  isArray: boolean
}

export function getTypeInfo<T>(typeFn: TypeFn<T | T[]>): TypeFnInfo<T> {
  const type = typeFn();
  const innerType = Array.isArray(type) ? type[0] : type;
  const isArray = innerType !== type;

  return {
    type,
    innerType,
    isArray,
  };
}
