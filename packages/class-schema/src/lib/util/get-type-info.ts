import { getInnerType } from './inner-type';
import { TypeFn } from './types';

export function getTypeInfo(typeFn: TypeFn) {
  const type = typeFn();
  const innerType = getInnerType(type);

  return {
    type,
    innerType,
    isArray: Array.isArray(type),
  };
}
