import { PropertySelector } from "./property-rule-types";

/**
 * 
 * @param match The partial FieldSchema to match.
 * @returns A `RuleSelector` that matches fields matching
 *          the given partial schema.
 */
 export function matches<Metadata extends object, Context = unknown>(match: Partial<Metadata>): PropertySelector<Metadata, Context> {
    return function (field): boolean {
        return Object.entries(match).every(
            ([key, value]) => field[key as keyof Metadata] === value
        );
    }
}


/**
 * 
 * @param keys The field keys to match
 * @returns A `RuleSelector` that matches fields whose schema key is one of `keys`.
 */
export function matchesPropertyKey<Metadata, Context = unknown>(...keys: PropertyKey[]): PropertySelector<Metadata, Context> {
    return function (field, key): boolean {
        return keys.includes(key);
    }
}

