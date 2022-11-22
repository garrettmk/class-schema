import { PropertyMetadata } from '../class-schema-types';
import { getTypeInfo } from './get-type-info';
import { TypeFn, AnyFunction, InnerType } from './types';
import { listOf } from './list-of';
import { flip } from './flip';


export function fakerMaker<T, O = T>(metadata: PropertyMetadata<T | T[], O>, fakerFn: TypeFn<InnerType<O>>): TypeFn<O> {
  const { isArray } = getTypeInfo(metadata.type as any);
  const { optional } = metadata;

  const maybeArrayFakerFn: AnyFunction = isArray
    ? () => listOf(3, () => fakerFn())
    : fakerFn;

  const maybeOptionalFakerFn = optional ? () => flip(maybeArrayFakerFn(), undefined) : maybeArrayFakerFn;

  return maybeOptionalFakerFn as TypeFn<O>;
}
