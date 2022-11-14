import { PropertyMetadata } from "../property-metadata-types";
import { getTypeInfo } from "./get-type-info";
import { TypeFn } from "./types";
import { listOf, flip } from "common";



export function fakerMaker<T, O = T>(metadata: PropertyMetadata<T>, fakerFn: TypeFn<O>): TypeFn {
    const { isArray } = getTypeInfo(metadata.type);
    const { optional } = metadata;

    const _fakerFn = isArray
        ? () => listOf(3, () => fakerFn())
        : fakerFn;

    return optional
        ? () => flip(_fakerFn(), undefined)
        : () => _fakerFn();
}