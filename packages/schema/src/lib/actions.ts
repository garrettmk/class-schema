import { applyPropertyDecorators } from '../lib/util/apply-property-decorators';
import { merge, PropertyKey, Constructor } from 'metadata-manager';
import { FieldMetadata } from './class-metadata-types';
import { RuleAction, ensureArray } from 'metadata-rules';


export type TargetContext = {
    target: Constructor
}


export type DecorateWithFn<F extends FieldMetadata, S extends F = F, C extends TargetContext = TargetContext> = (field: S, key: PropertyKey, context: C) => PropertyDecorator | PropertyDecorator[];

/**
 * Applies the given decorators to the target's field.
 * 
 * @param decorators The decorators to apply
 */
export function decorateWith<F extends FieldMetadata = FieldMetadata, S extends F = F, C extends TargetContext = TargetContext>(decorators: PropertyDecorator[]): RuleAction<F, S, C>;
/**
 * 
 * @param decoratorsFn A function that returns decorators to apply.
 */
export function decorateWith<F extends FieldMetadata = FieldMetadata, S extends F = F, C extends TargetContext = TargetContext>(decoratorsFn: DecorateWithFn<F, S, C>): RuleAction<F, S, C>;
export function decorateWith<F extends FieldMetadata = FieldMetadata, S extends F = F, C extends TargetContext = TargetContext>(decoratorsOrFn: PropertyDecorator[] | DecorateWithFn<F, S, C>): RuleAction<F, S, C> {
    return function (field, propertyKey, context) {
        const { target } = context;
        const decorators = typeof decoratorsOrFn === 'function'
            ? decoratorsOrFn(field, propertyKey, context)
            : decoratorsOrFn;

        const decoratorsArray = ensureArray(decorators);

        applyPropertyDecorators(target.prototype, propertyKey, decoratorsArray);
    }
}


export type UpdateWithFn<F extends FieldMetadata = FieldMetadata, S extends F = F, C = unknown> = (field: S, key: PropertyKey, context: C) => Partial<F>;

/**
 * 
 * @param update A `Partial<FieldMetadata>` to merge with the current `FieldMetadata`
 */
export function updateWith<F extends FieldMetadata = FieldMetadata, S extends F = F>(update: Partial<F>): RuleAction<F, S>;
/**
 * 
 * @param updateFn A function that returns a `Partial<FieldMetadata>` to merge into the field.
 */
export function updateWith<F extends FieldMetadata = FieldMetadata, S extends F = F, C = unknown>(updateFn: UpdateWithFn<F, S, C>): RuleAction<F, S>;
/**
 * 
 * @returns The current `FieldMetadata` merged with the given update.
 */
export function updateWith<F extends FieldMetadata = FieldMetadata, S extends F = F, C = unknown>(updateOrFn: Partial<F> | UpdateWithFn<F, S, C>): RuleAction<F, S, C> {
    return function (field, propertyKey, context) {
        const update = typeof updateOrFn === 'function' 
            ? updateOrFn(field, propertyKey, context)
            : updateOrFn;

        return merge(field, update);
    }
}