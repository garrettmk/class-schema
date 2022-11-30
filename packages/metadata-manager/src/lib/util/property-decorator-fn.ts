import { MetadataDict, MetadataManager } from "../types";
import { Constructor } from "@garrettmk/ts-utils";

/**
 * Returns a decorator that merges `meta` with the target property's current
 * metadata.
 */
export type PropertyDecoratorFn<PropertyMetadata> = (meta: PropertyMetadata) => PropertyDecorator;

/**
 *
 * @param manager The MetadataManager to use
 * @returns A `PropertyMetadataDecoratorFn` that uses `manager` to assign and merge the target's metadata
 *
 * @example ```typescript
 * const Manager = MetadataManagerClass();
 *
 * const Property = PropertyMetadataDecoratorFn(Manager);
 *
 * class SomeClass {
 *  @Property(...)
 *  someProperty!: any;
 * }
 * ```
 */
export function propertyDecoratorFn<PropertyMetadata>(manager: MetadataManager<MetadataDict<PropertyMetadata>, Constructor>): PropertyDecoratorFn<PropertyMetadata> {
  return function (meta: PropertyMetadata) {
    return function (target, key) {
      manager.mergeMetadata(target.constructor as Constructor, {
        [key]: meta
      });
    };
  };
}
