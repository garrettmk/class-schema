import { TargetContext, TypeFn } from "./util/types"
import { MetadataManagerClass, PropertyMetadataDecoratorFn } from '@/metadata-manager';


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

export type PropertyMetadata<T = unknown> = 
    T extends boolean ? BooleanFieldMetadata :
    T extends string ? StringFieldMetadata :
    T extends number ? NumberFieldMetadata :
    GenericFieldMetadata;


export type ClassPropertiesMetadata = {
    [key in PropertyKey]: PropertyMetadata
}

export type PrototypeTargetContext = TargetContext<object>;

export class PropertiesMetadataManager extends MetadataManagerClass<ClassPropertiesMetadata, PrototypeTargetContext>() {};
export const FieldMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);
