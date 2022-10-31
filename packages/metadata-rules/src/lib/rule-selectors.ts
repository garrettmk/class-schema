import { PropertyMetaRuleSelector } from "./property-rule-set";
import { RuleSelector } from "./rule-set";


/**
 * 
 * @returns A `RuleSelector` that always activates.
 */
export function always<M, S extends M = M, C = unknown>(): RuleSelector<M, S, C> {
    return function (field): field is S {
        return true;
    }
}


/**
 * 
 * @returns A `RuleSelector` that never activates.
 */
export function never<M, S extends M = M, C = unknown>(): RuleSelector<M, S, C> {
    return function (field): field is S {
        return false;
    }
}


/**
 * 
 * @param conditions A list of `RuleSelectors` to match with.
 * @returns A `RuleSelector` that matches fields that match all
 *          the given rules.
 */
export function and<M, S extends M = M, C = unknown>(...conditions: RuleSelector<M, S, C>[]): RuleSelector<M, S, C>;
export function and<M, S extends M = M, C = unknown>(...conditions: PropertyMetaRuleSelector<M, S, C>[]): PropertyMetaRuleSelector<M, S, C>;
export function and<M, S extends M = M, C = unknown>(...conditions: (RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C>)[]): RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C> {
    return function (...args: Parameters<RuleSelector<M, S, C>> | Parameters<PropertyMetaRuleSelector<M, S, C>>): boolean {
        if (args.length === 2)
            return conditions.every(condition => (condition as RuleSelector<M, S, C>)(...args));
        else
            return conditions.every(condition => (condition as PropertyMetaRuleSelector<M, S, C>)(...args));
    }
}


/**
 *  
 * @param conditions A list of `RuleSelectors` to match with.
 * @returns A `RuleSelector` that matches fields that match any
 *          of the given rules.
 */
export function or<M, S extends M = M, C = unknown>(...conditions: RuleSelector<M, S, C>[]): RuleSelector<M, S, C>;
export function or<M, S extends M = M, C = unknown>(...conditions: PropertyMetaRuleSelector<M, S, C>[]): PropertyMetaRuleSelector<M, S, C>;
export function or<M, S extends M = M, C = unknown>(...conditions: (RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C>)[]): RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C> {
    return function (...args: Parameters<RuleSelector<M, S, C>> | Parameters<PropertyMetaRuleSelector<M, S, C>>): boolean {
        if (args.length === 2)
            return conditions.some(condition => (condition as RuleSelector<M, S, C>)(...args));
        else
            return conditions.some(condition => (condition as PropertyMetaRuleSelector<M, S, C>)(...args));
    }
}


/**
 *  
 * @param condition The condition to match with
 * @returns A `RuleSelector` that matches fields that do NOT
 *          match the given condition.
 */
export function not<M, S extends M = M, C = unknown>(condition: RuleSelector<M, S, C>): RuleSelector<M, S, C>;
export function not<M, S extends M = M, C = unknown>(condition: PropertyMetaRuleSelector<M, S, C>): PropertyMetaRuleSelector<M, S, C>;
export function not<M, S extends M = M, C = unknown>(condition: RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C>): RuleSelector<M, S, C> | PropertyMetaRuleSelector<M, S, C> {
    return function (...args: Parameters<RuleSelector<M, S, C>> | Parameters<PropertyMetaRuleSelector<M, S, C>>): boolean {
        if (args.length === 2)
            return !(condition as RuleSelector<M, S, C>)(...args);
        else
            return !(condition as PropertyMetaRuleSelector<M, S, C>)(...args);
    }
}