import { ClassMetaDecoratorFn, Constructor, MetadataManagerClass, PropertyMetadataDecoratorFn } from "metadata-manager";


export type TypeFn<T = unknown> = () => T;


export type ClassMetadata = {
    description?: string
}

export type FieldMetadata = {
    type: TypeFn
    optional?: boolean
    unique?: boolean
    description?: string
}

export type FieldsMetadata = {
    [key in string | symbol]: FieldMetadata
}


export class ClassMetadataManager extends MetadataManagerClass<ClassMetadata, Constructor>() {}
export class FieldsMetadataManager extends MetadataManagerClass<FieldsMetadata, object>() {};

export const ClassMeta = ClassMetaDecoratorFn(ClassMetadataManager);
export const FieldMeta = PropertyMetadataDecoratorFn(FieldsMetadataManager);

