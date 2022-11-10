import { PropertySelector } from "./property-rule-types";
import { MetadataSelector } from './metadata-rule-types';


/**
 * 
 * @returns A `MetadataSelector` that always activates.
 */
export function always<Metadata, Context = unknown>(): MetadataSelector<Metadata, Context> {
    return function (field) {
        return true;
    }
}


/**
 * 
 * @returns A `MetadataSelector` that never activates.
 */
export function never<Metadata, Context = unknown>(): MetadataSelector<Metadata, Context> {
    return function (field) {
        return false;
    }
}


/**
 * 
 * @param conditions A list of `RuleSelectors` to match with.
 * @returns A `MetadataSelector` that matches fields that match all
 *          the given rules.
 */
export function and<Metadata, Context = unknown>(...conditions: MetadataSelector<Metadata, Context>[]): MetadataSelector<Metadata, Context>;
export function and<Metadata, Context = unknown>(...conditions: PropertySelector<Metadata, Context>[]): PropertySelector<Metadata, Context>;
export function and<Metadata, Context = unknown>(...conditions: (MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context>)[]): MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context> {
    return function (...args: Parameters<MetadataSelector<Metadata, Context>> | Parameters<PropertySelector<Metadata, Context>>): boolean {
        if (args.length === 2)
            return conditions.every(condition => (condition as MetadataSelector<Metadata, Context>)(...args));
        else
            return conditions.every(condition => (condition as PropertySelector<Metadata, Context>)(...args));
    }
}


/**
 *  
 * @param conditions A list of `RuleSelectors` to match with.
 * @returns A `MetadataSelector` that matches fields that match any
 *          of the given rules.
 */
export function or<Metadata, Context = unknown>(...conditions: MetadataSelector<Metadata, Context>[]): MetadataSelector<Metadata, Context>;
export function or<Metadata, Context = unknown>(...conditions: PropertySelector<Metadata, Context>[]): PropertySelector<Metadata, Context>;
export function or<Metadata, Context = unknown>(...conditions: (MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context>)[]): MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context> {
    return function (...args: Parameters<MetadataSelector<Metadata, Context>> | Parameters<PropertySelector<Metadata, Context>>): boolean {
        if (args.length === 2)
            return conditions.some(condition => (condition as MetadataSelector<Metadata, Context>)(...args));
        else
            return conditions.some(condition => (condition as PropertySelector<Metadata, Context>)(...args));
    }
}


/**
 *  
 * @param condition The condition to match with
 * @returns A `MetadataSelector` that matches fields that do NOT
 *          match the given condition.
 */
export function not<Metadata, Context = unknown>(condition: MetadataSelector<Metadata, Context>): MetadataSelector<Metadata, Context>;
export function not<Metadata, Context = unknown>(condition: PropertySelector<Metadata, Context>): PropertySelector<Metadata, Context>;
export function not<Metadata, Context = unknown>(condition: MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context>): MetadataSelector<Metadata, Context> | PropertySelector<Metadata, Context> {
    return function (...args: Parameters<MetadataSelector<Metadata, Context>> | Parameters<PropertySelector<Metadata, Context>>): boolean {
        if (args.length === 2)
            return !(condition as MetadataSelector<Metadata, Context>)(...args);
        else
            return !(condition as PropertySelector<Metadata, Context>)(...args);
    }
}