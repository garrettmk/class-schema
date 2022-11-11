import { merge } from '../lib/merge';

describe('merge', () => {
  const a = {
    one: '1',
    two: '2',
  };

  const b = {
    two: 2,
    three: 3,
  };

  it('should return a shallow merge of a and b', () => {
    const expected = { ...a, ...b };

    expect(merge(a, b)).toMatchObject(expected);
  });

  it('should return b if a is undefiend', () => {
    expect(merge(undefined, b)).toMatchObject(b);
  });

  it('should return a if b is undefined', () => {
    expect(merge(a, undefined)).toMatchObject(a);
  });

  it('should return undefined if both a and b are undefined', () => {
    expect(merge(undefined, undefined)).toBeUndefined();
  });
});
