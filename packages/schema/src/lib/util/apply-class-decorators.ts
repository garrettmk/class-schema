import { chainClassDecorators, ConditionalClassDecorator } from './chain-class-decorators';
import { Constructor } from '@/lib/types';

/**
 * Chains a list of `ClassDecorators`, then applies the resulting decorator
 * to `target`.
 * 
 * @param target The class constructor to decorate
 * @param decorators The list of decorators to chain
 */
export function applyClassDecorators(target: Constructor, decorators: (ClassDecorator | ConditionalClassDecorator)[]): void {
    chainClassDecorators(...decorators)(target);
}