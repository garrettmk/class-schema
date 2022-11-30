import { MetadataManager } from "../types";
import { Constructor } from "@garrettmk/ts-utils";

/**
 * A function that takes a `Metadata` value, and returns a `ClassDecorator`
 * that merges that metadata with the target class's metadata.
 */
 export type ClassDecoratorFn<Metadata> = (meta: Metadata) => ClassDecorator;

 /**
  * Generates a `ClassMetadataDecoratorFn` for the given manager.
  * @param manager
  * @returns
  *
  * @example ```typescript
  * const Manager = MetadataManagerClass();
  *
  * const Class = ClassMetadataDecoratorFn(Manager);
  *
  * @Class(...)
  * class SomeClass {
  *  // class properties...
  * }
  * ```
  */
 export function classDecoratorFn<Metadata>(manager: MetadataManager<Metadata, Constructor>): ClassDecoratorFn<Metadata> {
   return function (meta: Metadata) {
     return function (target) {
       manager.mergeMetadata(target as unknown as Constructor, meta);
     };
   };
 }