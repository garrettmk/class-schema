import { TypeFn } from "../class-metadata-types";
import { getInnerType } from "./inner-type";

export function getTypeInfo(typeFn: TypeFn) {
    const type = typeFn();
    const innerType = getInnerType(type);

    return {
        type,
        innerType,
        isArray: Array.isArray(type),
    }
}