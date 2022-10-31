import { PropertiesMeta, PropertyMetaRuleSelector } from "./property-rule-set";


/**
 * 
 * @param match The partial FieldSchema to match.
 * @returns A `RuleSelector` that matches fields matching
 *          the given partial schema.
 */
 export function matches<M extends PropertiesMeta, S extends M = M, C = unknown>(match: Partial<S>): PropertyMetaRuleSelector<M, S, C> {
    return function (field): field is S {
        return Object.entries(match).every(
            ([key, value]) => field[key as keyof M] === value
        );
    }
}


/**
 * 
 * @param keys The field keys to match
 * @returns A `RuleSelector` that matches fields whose schema key is one of `keys`.
 */
export function matchesSchemaKey<M extends PropertiesMeta, S extends M = M, C = unknown>(...keys: PropertyKey[]): PropertyMetaRuleSelector<M, S, C> {
    return function (field, key): field is S {
        return keys.includes(key);
    }
}