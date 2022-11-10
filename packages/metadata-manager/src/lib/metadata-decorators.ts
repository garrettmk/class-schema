import { MetadataDict, PropertyDecorator, MetadataManager, ClassDecorator } from "./types";


export type PropertyMetadataDecorator<PropertyMetadata, Target> = (meta: PropertyMetadata) => PropertyDecorator<Target>;

export function PropertyMetadataDecoratorFn<PropertyMetadata, Target>(manager: MetadataManager<MetadataDict<PropertyMetadata>, Target>): PropertyMetadataDecorator<PropertyMetadata, Target> {
  return function (meta: PropertyMetadata) {
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