export type TypeFn<T = unknown> = () => T;

export type TargetContext<Target = unknown> = {
  target: Target;
};
