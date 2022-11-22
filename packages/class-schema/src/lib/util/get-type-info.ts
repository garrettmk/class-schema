import { innerType as getInnerType } from './inner-type';
import { InnerType, TypeFn } from './types';

export type TypeFnInfo<T> = {
  type: T
  innerType: InnerType<T>
  isArray: boolean
}

export function getTypeInfo<T>(typeFn: TypeFn<T>): TypeFnInfo<T> {
  const type = typeFn();
  const innerType = getInnerType(type);

  return {
    type,
    innerType,
    isArray: Array.isArray(type),
  };
}
