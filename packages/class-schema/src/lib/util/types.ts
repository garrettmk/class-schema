import type { EnumObject } from "@garrettmk/ts-utils";

export { EnumObject as Enum };

export type TypeFn<T = unknown> = () => T;

export type InnerType<T> = T extends unknown[] ? T[0] : T;

export type TargetContext<Target = unknown> = {
  target: Target;
};

export type BuiltIn = string | number | boolean | Date;

export type BuiltInConstructor = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor;