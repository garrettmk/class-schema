import { AnyFunction } from "./types";


export function and<Fn extends AnyFunction>(...conditions: ((...params: Parameters<Fn>) => unknown)[]): (...params: Parameters<Fn>) => unknown {
    return function (...args: Parameters<Fn>) {
      return conditions.every((condition) => condition(...args));
    };
  }
  
  export function or<Fn extends AnyFunction>(...conditions: ((...params: Parameters<Fn>) => unknown)[]): (...params: Parameters<Fn>) => unknown {
    return function (...args: Parameters<Fn>) {
      return conditions.some((condition) => condition(...args));
    };
  }
  
  export function not<Fn extends AnyFunction>(condition: (...params: Parameters<Fn>) => unknown): (...params: Parameters<Fn>) => unknown {
    return function (...args: Parameters<Fn>) {
      return !condition(...args);
    };
  }
  