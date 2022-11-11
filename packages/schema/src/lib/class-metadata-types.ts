import { ClassMetadataDecoratorFn, MetadataManagerClass, PropertyKey, PropertyMetadataDecoratorFn } from "@/metadata-manager";
import { Constructor } from "@/util";
import { TypeFn, TargetContext } from "./util/types";


export enum ObjectType {
    InputType = 'INPUT_TYPE',
    ObjectType = 'OBJECT_TYPE',
    EntityType = 'ENTITY_TYPE'
}

export type ClassMetadata = {
    description?: string
    pluralName?: string
    objectTypes?: ObjectType[]
}

export type ClassTargetContext = TargetContext<Constructor>;


export class ClassMetadataManager extends MetadataManagerClass<ClassMetadata, Constructor>() {}
export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);

