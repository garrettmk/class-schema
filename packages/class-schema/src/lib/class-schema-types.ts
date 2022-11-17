import { Constructor } from 'common'
import { MetadataAction } from 'metadata-actions'
import { MetadataManagerClass, PropertyKey } from 'metadata-manager';
import { TypeFn } from './util/types';

export enum ObjectType {
  InputType = 'INPUT_TYPE',
  ObjectType = 'OBJECT_TYPE',
  EntityType = 'ENTITY_TYPE',
}

export type ClassMetadata = {
  description?: string
  pluralName?: string
  objectTypes?: ObjectType[]
};

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
};

export type BooleanPropertyMetadata = CommonPropertyMetadata<boolean> & {
  eq?: boolean
  ne?: boolean
};

export type StringPropertyMetadata = CommonPropertyMetadata & {
  minLength?: number
  maxLength?: number
  in?: string[]
  nin?: string[]
  matches?: RegExp
};

export type NumberPropertyMetadata = CommonPropertyMetadata & {
  min?: number
  max?: number
  eq?: number
  ne?: number
  in?: number[]
  nin?: number[]
};

export type DatePropertyMetadata = CommonPropertyMetadata & {
  min?: Date
  max?: Date
}

export type PropertyMetadata<T = unknown> = 
  T extends BooleanConstructor | BooleanConstructor[] ? BooleanPropertyMetadata : 
  T extends StringConstructor | StringConstructor[] ? StringPropertyMetadata : 
  T extends NumberConstructor | NumberConstructor[] ? NumberPropertyMetadata : 
  T extends DateConstructor | DateConstructor[] ? DatePropertyMetadata :
  CommonPropertyMetadata;

export type PropertiesMetadata = {
  [key in PropertyKey]: PropertyMetadata
};

export type PropertyContext = {
  target: object
  propertyKey: PropertyKey
};

export const ClassMetadataManager = MetadataManagerClass<ClassMetadata, Constructor>();

export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;

export const PropertiesMetadataManager = MetadataManagerClass<PropertiesMetadata, object>();

export type ClassPropertyAction = MetadataAction<PropertyMetadata, PropertyContext>;
