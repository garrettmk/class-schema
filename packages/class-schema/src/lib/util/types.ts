
/**
 * A constructor function.
 */
export type Constructor<T = any> = new () => T;


/**
 * Represents any function. Preferred over using `Function` as a type.
 */
export type AnyFunction = (...args: any[]) => any;

 /**
  * A value of type T, or an array of items of type T
  */
export type MaybeArray<T> = T | T[];

 /**
  * The types of an object type's values.
  */
export type Values<T extends object> = T[keyof T];

export type TypeFn<T = unknown> = () => T;

export type TargetContext<Target = unknown> = {
  target: Target;
};
