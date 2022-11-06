import { MetadataDict, PropertyDecorator, MetadataManager, ClassDecorator } from "./types";


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



export type ClassMetadataDecorator<Metadata, Target> = (meta: Metadata) => ClassDecorator<Target>;

export function ClassMetadataDecoratorFn<Metadata, Target>(manager: MetadataManager<Metadata, Target>): ClassMetadataDecorator<Metadata, Target> {
  return function (meta: Metadata) {
    return function (target: Target) {
      manager.mergeMetadata(target, meta);
    };
  };
}