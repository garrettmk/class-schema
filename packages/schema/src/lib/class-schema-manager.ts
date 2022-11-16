import { applyActions, applyActionsToProperties, MetadataAction } from "metadata-actions";
import { MetadataManagerClass, ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from 'metadata-manager';
import { Constructor } from "common";
import { validationActions } from "./action-sets/validation-actions";
import { ClassMetadata, ClassContext, PropertiesMetadata, PropertyContext, PropertyMetadata } from "./class-schema-types";


export const ClassMetadataManager = MetadataManagerClass<ClassMetadata, Constructor>();
export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);

export const PropertiesMetadataManager = MetadataManagerClass<PropertiesMetadata, object>();
export const PropertyMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);


export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;
export type ClassPropertyAction = MetadataAction<PropertyMetadata, PropertyContext>;

export class ClassSchemaManager {
    protected static classActions: ClassMetadataAction[] = [];
    protected static propertyActions: ClassPropertyAction[] = [
        ...validationActions
    ];


    public static applyActions() {
        PropertiesMetadataManager.entries()
            .forEach(([target, metadata]) => {
                const context = { target };
                const result = applyActionsToProperties(metadata, context, this.propertyActions);
                
                PropertiesMetadataManager.setMetadata(target, result);
            });
        
        ClassMetadataManager.entries()
            .forEach(([target, metadata]) => {
                const context: ClassContext = { target };
                const result = applyActions(metadata, context, this.classActions);

                ClassMetadataManager.setMetadata(target, result);
            });
    }
}