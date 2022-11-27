import { InnerType, TypeFn } from './types';

export function innerType<T>(typeFn: TypeFn<T>): InnerType<T> {
  const typeValue = typeFn();

  if (Array.isArray(typeValue)) return typeValue[0];
  else return typeValue as InnerType<T>;
}
