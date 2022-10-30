/**
 * A class constructor.
 */
export type Constructor<T = unknown> = new () => T

export type AnyFunction = (...args: unknown[]) => unknown;

export type ClassDecorator<T extends Function> = (target: T) => T | void;

export type PropertyDecorator<T extends Function> = (target: T, key: string | symbol) => void;

export type PropertiesMetadata<M> = Record<string | symbol, M>;
