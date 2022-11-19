import { PropertyMetadata } from '../class-schema-types';
import { getTypeInfo } from './get-type-info';
import { TypeFn, AnyFunction } from './types';
import { listOf } from './list-of';
import { flip } from './flip';

export function fakerMaker<T, O = T>(
  metadata: PropertyMetadata<T>,
  fakerFn: TypeFn<O>
): TypeFn<T> {
  const { isArray } = getTypeInfo(metadata.type);
  const { optional } = metadata;

  let _fakerFn: AnyFunction = isArray
    ? () => listOf(3, () => fakerFn())
    : fakerFn;

  _fakerFn = optional ? () => flip(_fakerFn(), undefined) : () => _fakerFn();

  return _fakerFn as TypeFn<T>;
}
