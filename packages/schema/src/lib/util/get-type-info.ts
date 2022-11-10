import { TypeFn } from "../class-schema-types";
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