import { MetadataDict } from '../../lib/types';
import { metadataEntries } from '../../lib/util/metadata-entries';

describe('metadataEntries', () => {
    const sym = Symbol('symbol');

    const metadata: MetadataDict = {
        one: 1,
        two: 'two',
        [sym]: 'symbol'
    };

    const expected = [
        ['one', 1],
        ['two', 'two'],
        [sym, 'symbol']
    ];

    it('should return expected entries', () => {
        const entries = metadataEntries(metadata);
        expect(entries).toMatchObject(expected);
    })
})