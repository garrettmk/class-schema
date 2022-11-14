import { MetadataDict, PropertyKey } from "metadata-manager";
import { PropertyAction, PropertyRule } from "./property-rule-types";
import { MaybeArray, ensureArray } from 'common';

export class PropertyRuleSet<PropertyMetadata, Context = unknown> {
    protected readonly rules: PropertyRule<PropertyMetadata, Context>[];

    constructor(...fromRules: (PropertyRule<PropertyMetadata, Context>[] | PropertyRuleSet<PropertyMetadata, Context>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof PropertyRuleSet ? from.rules : from);
    }

    public apply(metadata: MetadataDict<PropertyMetadata>, context: Context): MetadataDict<PropertyMetadata> {
        return Object.entries(metadata).reduce(
            (result, [propertyKey, field]) => {
                result[propertyKey] = this.applyToField(this.rules, field, propertyKey, context);
                return result;
            },
            metadata
        ) ?? metadata;
    }

    protected applyToField(rules: MaybeArray<PropertyRule<PropertyMetadata, Context>>, propertyMeta: PropertyMetadata, propertyKey: PropertyKey, context: Context): PropertyMetadata {
        return ensureArray(rules).reduce(
            (result, rule) => {
                const shouldActivate = rule.if(result, propertyKey, context);
                const actionsOrRules = shouldActivate ? rule.then : rule.else;

                if (actionsOrRules)
                    return this.applyActionsOrRules(actionsOrRules, result, propertyKey, context);

                return result;
            },
            propertyMeta
        ) ?? propertyMeta;
    }

    protected applyActionsOrRules(actionsOrRules: MaybeArray<PropertyAction<PropertyMetadata, Context> | PropertyRule<PropertyMetadata, Context>>, propertyMeta: PropertyMetadata, propertyKey: PropertyKey, context: Context): PropertyMetadata {
        return ensureArray(actionsOrRules).reduce(
            (result, actionOrRule) => {
                if (typeof actionOrRule === 'function')
                    return actionOrRule(result, propertyKey, context) ?? result;
                else
                    return this.applyToField(actionOrRule, result, propertyKey, context);
            },
            propertyMeta
        ) ?? propertyMeta;
    }
}