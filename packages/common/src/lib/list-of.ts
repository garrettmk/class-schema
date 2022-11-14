export function listOf<T>(count: number, fn: (index: number) => T): T[] {
  return Array.from(new Array(count)).map((_, index) => {
    return fn(index);
  });
}
