import { MaybeArray } from "./types";
import { ensureArray } from "./util";


/**
 * A function that returns `true` if a rule should apply
 * to a field.
 */
 export type RuleSelector<M, S extends M = M, C = unknown> = (meta: M, context: C) => unknown;

 /**
  * A function that is activated for a selected field.
  */
 export type RuleAction<M, S extends M = M, C = unknown> = (meta: S, context: C) => M | void;

 /**
  * A `RuleSelector` paired with a `RuleAction`. If the selector
  * returns `true` for a particular field, the action with be
  * executed.
  */
 export type MetaRule<M, S extends M = M, C = unknown> = {
   if: RuleSelector<M, S, C>,
   then: MaybeArray<RuleAction<M, S, C> | MetaRule<M, S, C>>
   else?: MaybeArray<RuleAction<M, M, C> | MetaRule<M, M, C>>
 }
 

export class MetaRuleSet<M, S extends M = M, C = unknown> {
    protected readonly rules: MetaRule<M, S, C>[];

    constructor(...fromRules: (MetaRule<M, S, C> | MetaRuleSet<M, S, C>)[]) {
        this.rules = fromRules.flatMap(from => from instanceof MetaRuleSet ? from.rules : from);
    }

    public apply(meta: M, context: C): M {
        return this.applyRules(this.rules, meta, context);
    }

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

