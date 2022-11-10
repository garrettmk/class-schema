import { ClassMetadataDecoratorFn, Constructor, MetadataManagerClass, PropertyKey, PropertyMetadataDecoratorFn } from "metadata-manager";


export type TypeFn<T = unknown> = () => T;


export type ClassMetadata = {
    description?: string
}


export type GenericFieldMetadata<T = unknown> = {
    type: TypeFn
    optional?: boolean
    unique?: boolean
    description?: string
    default?: T | TypeFn<T>
    faker?: TypeFn<T>
}

export type BooleanFieldMetadata = GenericFieldMetadata<boolean> & {
    eq?: boolean   
}

export type StringFieldMetadata = GenericFieldMetadata & {
    minLength?: number
    maxLength?: number
    regex?: RegExp
}

export type NumberFieldMetadata = GenericFieldMetadata & {
    min?: number
    max?: number
}

export type FieldMetadata<T = unknown> = 
    T extends string ? StringFieldMetadata :
    T extends number ? NumberFieldMetadata :
    GenericFieldMetadata;


export type ClassFieldsMetadata = {
    [key in PropertyKey]: FieldMetadata
}

export type TargetContext<Target = unknown> = {
    target: Target
}



export class ClassMetadataManager extends MetadataManagerClass<ClassMetadata, Constructor>() {}
export class ClassFieldsMetadataManager extends MetadataManagerClass<ClassFieldsMetadata, object>() {};

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);
export const FieldMeta = PropertyMetadataDecoratorFn(ClassFieldsMetadataManager);

