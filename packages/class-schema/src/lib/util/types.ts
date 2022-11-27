
export type TypeFn<T = unknown> = () => T;

export type InnerType<T> = T extends unknown[] ? T[0] : T;

export type TargetContext<Target = unknown> = {
  target: Target;
};
