import { PropertyMetadata } from "../class-schema-types";
import { getTypeInfo } from "./get-type-info";
import { TypeFn } from "./types";
import { listOf, flip, AnyFunction } from "common";



export function fakerMaker<T, O = T>(metadata: PropertyMetadata<T>, fakerFn: TypeFn<O>): TypeFn<T> {
    const { isArray } = getTypeInfo(metadata.type);
    const { optional } = metadata;

    let _fakerFn: AnyFunction = isArray
        ? () => listOf(3, () => fakerFn())
        : fakerFn;

    _fakerFn = optional
        ? () => flip(_fakerFn(), undefined)
        : () => _fakerFn();

    return _fakerFn as TypeFn<T>
}