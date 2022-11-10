
export type MaybeArray<T> = T | T[];

export type Values<T extends object> = T[keyof T];
