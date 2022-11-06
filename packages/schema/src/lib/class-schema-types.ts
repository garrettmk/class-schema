import { ClassMetadataDecoratorFn, Constructor, MetadataManagerClass, PropertyKey, PropertyMetadataDecoratorFn } from "metadata-manager";


export type TypeFn<T = unknown> = () => T;


export type ClassMetadata = {
    description?: string
}

export type FieldMetadata<T = unknown> = {
    type: TypeFn
    optional?: boolean
    unique?: boolean
    description?: string
    default?: T | TypeFn<T>
} & T extends string ? {
    minLength?: number
    maxLength?: number
    regex?: RegExp
} : T extends number ? {
    min?: number
    max?: number
} : never;

export type ClassFieldsMetadata = {
    [key in PropertyKey]: FieldMetadata
}


export class ClassMetadataManager extends MetadataManagerClass<ClassMetadata, Constructor>() {}
export class ClassFieldsMetadataManager extends MetadataManagerClass<ClassFieldsMetadata, object>() {};

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);
export const FieldMeta = PropertyMetadataDecoratorFn(ClassFieldsMetadataManager);

