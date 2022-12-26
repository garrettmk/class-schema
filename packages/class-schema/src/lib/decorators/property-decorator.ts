import { Constructor } from "@garrettmk/ts-utils";
import { PropertiesMetadataManager } from "../managers/properties-metadata-manager";
import { PropertyMetadata } from "../types";
import { TypeFn } from "../util/types";

/**
 * Register a property with PropertiesMetadataManager.
 * 
 * @param type
 * @param meta
 * @returns
 */
export function Property<T>(type: TypeFn<T>, meta?: Omit<PropertyMetadata<T>, 'type'>): PropertyDecorator {
    return function (_target, propertyKey) {
        const target = _target.constructor as Constructor;

        if (PropertiesMetadataManager.hasOwnMetadata(target)) {
            const currentMeta = PropertiesMetadataManager.getOwnMetadata(target);
            const newMeta = PropertiesMetadataManager.merge(currentMeta, {
                [propertyKey]: { type, ...meta }
            });

            PropertiesMetadataManager.setMetadata(target, newMeta);
        } else {
            PropertiesMetadataManager.setMetadata(target, {
                [propertyKey]: { type, ...meta }
            });
        }
    }
}