import { MetadataDict, PropertyDecorator, MetadataManager } from "./types";


export type PropertyMetadataDecorator<FieldMetadata, Target> = (meta: FieldMetadata) => PropertyDecorator<Target>;

export function PropertyMetadataDecoratorFn<FieldMetadata, Target>(manager: MetadataManager<MetadataDict<FieldMetadata>, Target>): PropertyMetadataDecorator<FieldMetadata, Target> {
  return function (meta: FieldMetadata) {
    return function (target, key) {
      manager.mergeMetadata(target as Target, {
        [key]: meta
      });
    };
  };
}
