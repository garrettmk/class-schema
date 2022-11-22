import { MetadataDict, PropertyDecorator, MetadataManager, ClassDecorator, Constructor } from "./types";


export type PropertyMetadataDecorator<PropertyMetadata> = (meta: PropertyMetadata) => PropertyDecorator;

export function PropertyMetadataDecoratorFn<PropertyMetadata>(manager: MetadataManager<MetadataDict<PropertyMetadata>, Constructor>): PropertyMetadataDecorator<PropertyMetadata> {
  return function (meta: PropertyMetadata) {
    return function (target, key) {
      manager.mergeMetadata(target.constructor as Constructor, {
        [key]: meta
      });
    };
  };
}



export type ClassMetadataDecorator<Metadata> = (meta: Metadata) => ClassDecorator;

export function ClassMetadataDecoratorFn<Metadata>(manager: MetadataManager<Metadata, Constructor>): ClassMetadataDecorator<Metadata> {
  return function (meta: Metadata) {
    return function (target) {
      manager.mergeMetadata(target, meta);
    };
  };
}