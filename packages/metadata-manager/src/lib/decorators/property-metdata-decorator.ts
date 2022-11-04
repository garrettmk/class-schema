import { MetadataManager } from "../metadata-managers/metadata-manager";
import { PropertiesMetadata, PropertyDecorator } from "../types";


export type PropertyMetadataDecorator<FieldMetadata> = (meta: FieldMetadata) => PropertyDecorator;

export function PropertyMetadataDecoratorFn<FieldMetadata, Target>(manager: MetadataManager<PropertiesMetadata<FieldMetadata>, Target>): PropertyMetadataDecorator<FieldMetadata> {
  return function (meta: FieldMetadata) {
    return function (target, key) {
      if (manager.hasMetadata(target as Target)) {
        const currentMeta = manager.getMetadata(target as Target);
        const mergedMeta = manager.mergeMetadatas(currentMeta, {
          [key]: meta,
        });

        manager.setMetadata(target as Target, mergedMeta);
      } else {
        const newMeta = {
          [key]: meta,
        };

        manager.setMetadata(target as Target, newMeta);
      }
    };
  };
}
