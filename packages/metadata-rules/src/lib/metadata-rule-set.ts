import { MaybeArray, ensureArray } from "@/util";
import { MetadataRule, MetadataAction } from "./metadata-rule-types";


 /**
  * Applies a set of rules to a given metadata value.
  */
export class MetadataRuleSet<Metadata, Context = unknown> {
    /**
     * @internal 
     */
    protected readonly rules: MetadataRule<Metadata, Context>[];

    /**
     * Create a `MetadataRuleSet`
     * @param fromRules An array of `MetadataRule`s or `MetadataRuleSet`s to use
     */
    constructor(...fromRules: (MetadataRule<Metadata, Context> | MetadataRuleSet<Metadata, Context>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof MetadataRuleSet ? from.rules : from);
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
    public apply(meta: Metadata, context: Context): Metadata {
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
    protected applyRules(rules: MaybeArray<MetadataRule<Metadata, Context>>, meta: Metadata, context: Context): Metadata {
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
    protected applyActionsOrRules(actionsOrRules: MaybeArray<MetadataAction<Metadata, Context> | MetadataRule<Metadata, Context>>, meta: Metadata, context: Context): Metadata {
        return ensureArray(actionsOrRules).reduce(
            (result, actionOrRule) => {
                if (typeof actionOrRule === 'function')
                    return actionOrRule(result, context) ?? result;
                else
                    return this.applyRules(actionOrRule, result, context);
            },
            meta
        ) ?? meta;
    }
}

