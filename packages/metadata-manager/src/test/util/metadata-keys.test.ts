import { MetadataDict } from '../../lib/types';
import { metadataKeys } from '../../lib/util/metadata-keys';

describe('metadataKeys', () => {
    const sym = Symbol('symbol');

    const metadata: MetadataDict = {
        one: 1,
        two: 'two',
        [sym]: 'symbol'
    };

    const expected = ['one', 'two', sym];

    it('should return expected keys', () => {
        const keys = metadataKeys(metadata);
        expect(keys).toMatchObject(expected);
    })
})