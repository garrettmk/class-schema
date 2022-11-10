import { MaybeArray } from "metadata-rules";

export function getInnerType<T>(type: MaybeArray<T>): T {
    if (Array.isArray(type))
        return type[0];
    else
        return type;
}