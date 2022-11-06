import { MaybeArray } from "./util/types";
import { ensureArray } from "./util/ensure-array";
import { PropertyKey } from "metadata-manager";

export type PropertyMetaRuleSelector<BaseMeta, SpecificMeta extends BaseMeta = BaseMeta, Context = unknown> = (meta: BaseMeta, propertyKey: PropertyKey, context: Context) => unknown;

export type PropertyMetaRuleAction<BaseMeta, SpecificMeta extends BaseMeta = BaseMeta, Context = unknown> = (meta: SpecificMeta, propertyKey: PropertyKey, context: Context) => BaseMeta | void;

export type PropertyMetaRule<BaseMeta, SpecificMeta extends BaseMeta = BaseMeta, Context = unknown> = {
    if: PropertyMetaRuleSelector<BaseMeta, SpecificMeta, Context>
    then: MaybeArray<PropertyMetaRuleAction<BaseMeta, SpecificMeta, Context> | PropertyMetaRule<BaseMeta, SpecificMeta, Context>>
    else?: MaybeArray<PropertyMetaRuleAction<BaseMeta, BaseMeta, Context> | PropertyMetaRule<BaseMeta, BaseMeta, Context>>
}

export type PropertiesMeta<BaseMeta = unknown> = Record<PropertyKey, BaseMeta>;



export class MetaPropertyRuleSet<BaseMeta, SpecificMeta extends BaseMeta = BaseMeta, Context = unknown> {
    protected readonly rules: PropertyMetaRule<BaseMeta, SpecificMeta, Context>[];

    constructor(...fromRules: (PropertyMetaRule<BaseMeta, SpecificMeta, Context> | MetaPropertyRuleSet<BaseMeta, SpecificMeta, Context>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof MetaPropertyRuleSet ? from.rules : from);
    }

    public apply(meta: PropertiesMeta<BaseMeta>, context: Context): PropertiesMeta<BaseMeta> {
        return Object.entries(meta).reduce(
            (result, [propertyKey, field]) => {
                result[propertyKey] = this.applyToField(this.rules, field, propertyKey, context);
                return result;
            },
            meta
        ) ?? meta;
    }

    protected applyToField(rules: MaybeArray<PropertyMetaRule<BaseMeta, SpecificMeta, Context>>, field: BaseMeta, propertyKey: PropertyKey, context: Context): BaseMeta {
        return ensureArray(rules).reduce(
            (result, rule) => {
                const shouldActivate = rule.if(result, propertyKey, context);
                const actionsOrRules = shouldActivate ? rule.then : rule.else;

                if (actionsOrRules)
                    return this.applyActionsOrRules(actionsOrRules, result, propertyKey, context);
                else
                    return result;
            },
            field
        ) ?? field;
    }

    protected applyActionsOrRules(actionsOrRules: MaybeArray<PropertyMetaRuleAction<BaseMeta, SpecificMeta, Context> | PropertyMetaRule<BaseMeta, SpecificMeta, Context>>, field: BaseMeta, key: PropertyKey, context: Context): BaseMeta {
        return ensureArray(actionsOrRules).reduce(
            (result, actionOrRule) => {
                if (typeof actionOrRule === 'function')
                    return actionOrRule(result as SpecificMeta, key, context) ?? result;
                else
                    return this.applyToField(actionOrRule, result, key, context);
            },
            field
        ) ?? field;
    }
}