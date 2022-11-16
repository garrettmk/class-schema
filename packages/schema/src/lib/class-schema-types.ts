import { PropertyKey } from 'metadata-manager';
import { Constructor } from "common";
import { TypeFn } from "./util/types";


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

export type ClassContext = {
    target: Constructor
};



export type CommonPropertyMetadata<T = unknown> = {
    type: TypeFn
    optional?: boolean
    unique?: boolean
    description?: string
    default?: T | TypeFn<T>
    faker?: TypeFn<T>
}

export type BooleanPropertyMetadata = CommonPropertyMetadata<boolean> & {
    eq?: boolean
    ne?: boolean
}

export type StringPropertyMetadata = CommonPropertyMetadata & {
    minLength?: number
    maxLength?: number
    in?: string[]
    nin?: string[]
    matches?: RegExp
}

export type NumberPropertyMetadata = CommonPropertyMetadata & {
    min?: number
    max?: number
}

export type PropertyMetadata<T = unknown> = 
    T extends (BooleanConstructor | BooleanConstructor[]) ? BooleanPropertyMetadata :
    T extends (StringConstructor | StringConstructor[]) ? StringPropertyMetadata :
    T extends (NumberConstructor | NumberConstructor[]) ? NumberPropertyMetadata :
    CommonPropertyMetadata;


export type PropertiesMetadata = {
    [key in PropertyKey]: PropertyMetadata
}

export type PropertyContext = {
    target: object
    propertyKey: PropertyKey
};