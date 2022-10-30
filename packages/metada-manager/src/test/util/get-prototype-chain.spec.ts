import { getPrototypeChain } from '../../lib/util/get-prototype-chain';


describe('getPrototypeChain', () => {
    class Parent {}
    class Child extends Parent {}

    it('should return a list of the constructor\'s prototypes', () => {
        const expected = [Child, Parent];

        expect(getPrototypeChain(Child)).toMatchObject(expected);
    });
})