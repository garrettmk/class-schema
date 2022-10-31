import { MaybeArray } from "./types";
import { ensureArray } from "./util";

export type PropertyMetaRuleSelector<F, S extends F = F, C = unknown> = (meta: F, propertyKey: string | symbol, context: C) => unknown;

export type PropertyMetaRuleAction<F, S extends F = F, C = unknown> = (meta: S, propertyKey: string | symbol, context: C) => F | void;

export type PropertyMetaRule<F, S extends F = F, C = unknown> = {
    if: PropertyMetaRuleSelector<F, S, C>
    then: MaybeArray<PropertyMetaRuleAction<F, S, C> | PropertyMetaRule<F, S, C>>
    else?: MaybeArray<PropertyMetaRuleAction<F, F, C> | PropertyMetaRule<F, F, C>>
}

export type PropertiesMeta<F> = Record<string | symbol, F>;



export class MetaPropertyRuleSet<F, S extends F = F, C = unknown> {
    protected readonly rules: PropertyMetaRule<F, S, C>[];

    constructor(...fromRules: (PropertyMetaRule<F, S, C> | MetaPropertyRuleSet<F, S, C>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof MetaPropertyRuleSet ? from.rules : from);
    }

    public apply(meta: PropertiesMeta<F>, context: C): PropertiesMeta<F> {
        return Object.entries(meta).reduce(
            (result, [propertyKey, field]) => {
                result[propertyKey] = this.applyToField(this.rules, field, propertyKey, context);
                return result;
            },
            meta
        ) ?? meta;
    }

    protected applyToField(rules: MaybeArray<PropertyMetaRule<F, S, C>>, field: F, propertyKey: string | symbol, context: C): F {
        return ensureArray(rules).reduce(
            (result, rule) => {
                const shouldActivate = rule.if(result, propertyKey, context);

                if (shouldActivate)
                    return this.applyActionsOrRules(rule.then, result, propertyKey, context);
                else if (rule.else)
                    return this.applyActionsOrRules(rule.else, result, propertyKey, context);
                else
                    return result;
            },
            field
        ) ?? field;
    }

    protected applyActionsOrRules(actionsOrRules: MaybeArray<PropertyMetaRuleAction<F, S, C> | PropertyMetaRule<F, S, C>>, field: F, key: string | symbol, context: C): F {
        return ensureArray(actionsOrRules).reduce(
            (result, actionOrRule) => {
                if (typeof actionOrRule === 'function')
                    return actionOrRule(result as S, key, context) ?? result;
                else
                    return this.applyToField(actionOrRule, result, key, context);
            },
            field
        ) ?? field;
    }
}