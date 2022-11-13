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
    ne?: boolean
}

export type StringFieldMetadata = GenericFieldMetadata & {
    minLength?: number
    maxLength?: number
    in?: string[]
    regex?: RegExp
}

export type NumberFieldMetadata = GenericFieldMetadata & {
    min?: number
    max?: number
}

export type PropertyMetadata<T = unknown> = 
    T extends BooleanConstructor ? BooleanFieldMetadata :
    T extends StringConstructor ? StringFieldMetadata :
    T extends NumberConstructor ? NumberFieldMetadata :
    GenericFieldMetadata;


export type ClassPropertiesMetadata = {
    [key in PropertyKey]: PropertyMetadata
}

export type PrototypeTargetContext = TargetContext<object>;

export class PropertiesMetadataManager extends MetadataManagerClass<ClassPropertiesMetadata, PrototypeTargetContext>() {};
export const FieldMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);
