import { InnerType } from './types';

export function innerType<T>(type: T): InnerType<T> {
  if (Array.isArray(type)) return type[0];
  else return type as InnerType<T>;
}
