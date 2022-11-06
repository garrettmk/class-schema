import { MetadataManagerClass } from "src/lib/metadata-manager";
import { ClassMetadataDecoratorFn } from 'src/lib/class-metadata-decorator';
import { Constructor, MetadataDict } from "src/lib/types";

describe('ClassMetadataDecorator', () => {
    const TestMetadataManager = MetadataManagerClass<MetadataDict<unknown>, Constructor>();
    const Meta = ClassMetadataDecoratorFn(TestMetadataManager);
    
    @Meta({ hello: 'there' })
    class TestTarget {}

    it('should save the expected metadata', () => {
        const expected: MetadataDict = {
            hello: 'there'
        };

        expect(TestMetadataManager.getMetadata(TestTarget)).toMatchObject(expected);
    });
})