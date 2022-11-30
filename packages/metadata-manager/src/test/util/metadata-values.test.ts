import { MetadataDict } from '../../lib/types';
import { metadataValues } from '../../lib/util/metadata-values';


describe('metadataValues', () => {
    const sym = Symbol('symbol');

    const metadata: MetadataDict = {
        one: 1,
        two: 'two',
        [sym]: 'symbol'
    };

    const expected = [1, 'two', 'symbol'];

    it('should return the expected values', () => {
        const values = metadataValues(metadata);
        expect(values).toMatchObject(expected);
    })
})