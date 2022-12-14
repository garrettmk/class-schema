import { PropertyMetadata } from '../types';
import { getTypeInfo } from './get-type-info';
import { TypeFn, InnerType } from './types';
import { AnyFunction, listOf, flip } from '@garrettmk/ts-utils';


export function fakerMaker<T, O = T>(metadata: PropertyMetadata<T | T[], O>, fakerFn: TypeFn<InnerType<O>>): TypeFn<O> {
  const { isArray } = getTypeInfo(metadata.type as any);
  const { optional } = metadata;

  const maybeArrayFakerFn: AnyFunction = isArray
    ? () => listOf(3, () => fakerFn())
    : fakerFn;

  const maybeOptionalFakerFn = optional ? () => flip(maybeArrayFakerFn(), undefined) : maybeArrayFakerFn;

  return maybeOptionalFakerFn as TypeFn<O>;
}
