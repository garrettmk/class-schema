import { ClassDecorator, MetadataManager } from "./types";


export type ClassMetadataDecorator<Metadata, Target> = (meta: Metadata) => ClassDecorator<Target>;


export function ClassMetadataDecoratorFn<Metadata, Target>(manager: MetadataManager<Metadata, Target>): ClassMetadataDecorator<Metadata, Target> {
  return function (meta: Metadata) {
    return function (target: Target) {
      manager.mergeMetadata(target, meta);
    };
  };
}