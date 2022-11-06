import { MaybeArray } from "./util/types";
import { ensureArray } from "./util/ensure-array";


/**
 * A function that returns `true` if a rule should be used.
 */
 export type RuleSelector<M, S extends M = M, C = unknown> = (meta: M, context: C) => unknown;

 /**
  * A function that is activated for a selected field.
  */
 export type RuleAction<M, S extends M = M, C = unknown> = (meta: S, context: C) => M | void;

 /**
  * A `RuleSelector` paired one or more `RuleAction`s. If the selector in the `if` key
  * returns `true` for a metadata, the actions under the `then` key will be run. Conversely, 
  * if the selector returns false, the actions under the `else` key will be run.
  * 
  * `then` and `else` can also contain nested rules.
  * 
  * @example ```
  * const rulesForStrings: MetaRule = {
  *     if: isStringMeta(),
  *     then: [
  *         {
  *             if: isEmptyString(),
  *             then: doSomething(),
  *             else: doSomethingElse(),
  *         },
  *         {
  *             ...
  *         }
  *     ]
  * }
  */
 export type MetaRule<M, S extends M = M, C = unknown> = {
   if: RuleSelector<M, S, C>,
   then: MaybeArray<RuleAction<M, S, C> | MetaRule<M, S, C>>
   else?: MaybeArray<RuleAction<M, M, C> | MetaRule<M, M, C>>
 }
 

 /**
  * Applies a set of rules to a given metadata value.
  */
export class MetaRuleSet<M, S extends M = M, C = unknown> {
    /**
     * @internal 
     */
    protected readonly rules: MetaRule<M, S, C>[];

    /**
     * Create a `MetaRuleSet`
     * @param fromRules An array of `MetaRule`s or `MetaRuleSet`s to use
     */
    constructor(...fromRules: (MetaRule<M, S, C> | MetaRuleSet<M, S, C>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof MetaRuleSet ? from.rules : from);
    }

    /**
     * Apply this rule set to the given metadata. Rules are applied sequentially,
     * with the return value of each action used as the input for the next rule.
     * If an action returns `undefined`, it's input will be used again for the
     * next rule. The net result is that if any rule returns a new metadata value,
     * this new metadata will be returned. Otherwise, the value given in `meta`
     * will be return unchanged.
     * 
     * @param meta A metadata value
     * @param context A context value to pass to selectors and actions
     * @returns `meta`, or a new metadata value
     */
    public apply(meta: M, context: C): M {
        return this.applyRules(this.rules, meta, context);
    }

    /**
     * @internal
     * Apply the given rules to the given metadata.
     * 
     * @param rules The rules to apply
     * @param meta The metadata value
     * @param context Extra data passed along to each rule.
     * @returns A new metadata value, or `meta`.
     */
    protected applyRules(rules: MaybeArray<MetaRule<M, S, C>>, meta: M, context: C): M {
        return ensureArray(rules).reduce(
            (result, rule) => {
                const shouldActivate = rule.if(result, context);

                if (shouldActivate)
                    return this.applyActionsOrRules(rule.then, result, context);
                else if (rule.else)
                    return this.applyActionsOrRules(rule.else, result, context);
                else
                    return result;
            },
            meta
        ) ?? meta;
    }

    /**
     * @internal
     * Apply a set of actions or rules to a given metadata value.
     * 
     * @param actionsOrRules The rules or actions to apply.
     * @param meta The metadata value to use.
     * @param context Extra data passed to the actions or rules
     * @returns A new metadata value, or `meta`
     */
    protected applyActionsOrRules(actionsOrRules: MaybeArray<RuleAction<M, S, C> | MetaRule<M, S, C>>, meta: M, context: C): M {
        return ensureArray(actionsOrRules).reduce(
            (result, actionOrRule) => {
                if (typeof actionOrRule === 'function')
                    return actionOrRule(result as S, context) ?? result;
                else
                    return this.applyRules(actionOrRule, result, context);
            },
            meta
        ) ?? meta;
    }
}

