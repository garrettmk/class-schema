import { getPrototypeChain } from '../lib/get-prototype-chain';

describe('getPrototypeChain', () => {
  class Grandparent {}
  class Parent extends Grandparent {}
  class Child extends Parent {}

  it("should return a list of the constructor's prototypes", () => {
    const expected = [Parent, Grandparent];

    expect(getPrototypeChain(Child)).toMatchObject(expected);
  });
});
