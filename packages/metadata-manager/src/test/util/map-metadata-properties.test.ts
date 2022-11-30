import { listOf } from '@garrettmk/ts-utils';
import { MetadataDict } from '../../lib/types';
import { mapMetadataProperties } from '../../lib/util/map-metadata-properties';
import { metadataKeys } from '../../lib/util/metadata-keys';
import { metadataValues } from '../../lib/util/metadata-values';

describe('mapMetadataProperties', () => {
    const sym = Symbol('symbol');

    const metadata: MetadataDict = {
        one: 1,
        two: 'two',
        [sym]: 'symbol'
    };

    const expectedCalls = [
        [1, 'one'],
        ['two', 'two'],
        ['symbol', sym]
    ];

    const callbackResult = {};

    const callback = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        callback.mockReturnValue(callbackResult);
    });

    it('should call the callback with each entry in the metadata', () => {
        mapMetadataProperties(metadata, callback);

        expect(callback.mock.calls).toMatchObject(expectedCalls);
    });

    it('should return an object with all the same keys', () => {
        const result = mapMetadataProperties(metadata, callback);

        expect(metadataKeys(result)).toMatchObject(metadataKeys(metadata));
    });

    it('should return an object whose values are the callback\'s return values', () => {
        const result = mapMetadataProperties(metadata, callback);

        expect(metadataValues(result)).toMatchObject(listOf(3, () => callbackResult));
    });
})