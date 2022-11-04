import { ClassDecorator } from "../types";
import { MetadataManager } from "../metadata-managers/metadata-manager";


export type ClassMetaDecorator<Metadata, Target> = (meta: Metadata) => ClassDecorator<Target>;


export function ClassMetaDecoratorFn<Metadata, Target>(manager: MetadataManager<Metadata, Target>): ClassMetaDecorator<Metadata, Target> {
  return function (meta: Metadata) {
    return function (target) {
      if (manager.hasMetadata(target)) {
        const currentMeta = manager.getMetadata(target);
        const newMeta = manager.mergeMetadatas(currentMeta, meta);
        
        manager.setMetadata(target, newMeta);
      } else {
        manager.setMetadata(target, meta);
      }
    };
  };
}