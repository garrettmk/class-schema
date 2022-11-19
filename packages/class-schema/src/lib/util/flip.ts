export function flip<A, B>(a: A, b: B): A | B {
  return Math.random() > 0.5 ? a : b;
}
