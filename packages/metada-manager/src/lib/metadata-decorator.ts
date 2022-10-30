import { MetadataManager } from "./metadata-manager";
import { ClassDecorator, PropertiesMetadata } from "./types";

export type ClassMetaDecorator<M, T extends Function> = (meta: M) => ClassDecorator<T>

export function ClassMetaDecoratorFn<M, T extends Function>(manager: MetadataManager<M, T>): ClassMetaDecorator<M, T> {
    return function (meta: M) {
        return function (target) {
            const currentMeta = manager.getOwnMeta(target);
            const newMeta = manager.mergeMetas(currentMeta, meta);
            
            manager.setOwnMeta(target, newMeta);
        }
    }
}



export type PropertyMetadataDecorator<F> = (meta: F) => PropertyDecorator;

export function PropertyMetadataDecoratorFn<F, T>(manager: MetadataManager<PropertiesMetadata<F>, T>): PropertyMetadataDecorator<F> {
    return function (meta: F) {
        return function (target, key) {
            if (manager.hasOwnMeta(target as T)) {
                const currentMeta = manager.getOwnMeta(target as T);
                const mergedMeta = manager.mergeMetas(currentMeta, {
                    [key]: meta
                });
    
                manager.setOwnMeta(target as T, mergedMeta);
            } else {
                const newMeta = {
                    [key]: meta
                };

                manager.setOwnMeta(target as T, newMeta);
            }
        }
    }
}