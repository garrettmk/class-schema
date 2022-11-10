import { chainPropertyDecorators, ConditionalPropertyDecorator } from './chain-property-decorators';

/**
 * Chains a list of PropertyDecorators, then applies the resulting decorator
 * to the given `target` and `propertyKey`.
 * 
 * @param target The class prototype to decorate
 * @param propertyKey The property key to decorate
 * @param decorators The decorators to chain
 */
export function applyPropertyDecorators(target: Object, propertyKey: string | symbol, decorators: (PropertyDecorator | ConditionalPropertyDecorator)[]) {
    chainPropertyDecorators(...decorators)(target, propertyKey);
}