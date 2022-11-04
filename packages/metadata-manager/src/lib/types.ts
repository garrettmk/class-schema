/**
 * A class constructor.
 */
export type Constructor<T = any>= new () => T;

export type AnyFunction = () => any;

export type ClassDecorator<T> = (target: T) => T | void;

export type PropertyKey = string | symbol;

export type PropertyDecorator<T = object> = (target: T, key: PropertyKey) => void;

export type PropertiesMetadata<FieldMetadata = unknown> = Record<string | symbol, FieldMetadata>;
