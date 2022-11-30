import { Values } from "@garrettmk/ts-utils";
import { entries } from "./entries";

export function mapMetadataValues<Metadata extends object, R>(metadata: Metadata, callback: (value: Values<Metadata>, propertyKey: string | symbol) => R) {
    return entries(metadata).reduce(
        (result, [key, value]) => {
            result[key as keyof Metadata] = callback(value, key);
            return result;
        },
        {} as Record<keyof Metadata, R>
    );
}