import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from 'src/lib/metadata-decorators';
import { MetadataManagerClass } from "src/lib/metadata-manager";
import { Constructor, MetadataDict } from "src/lib/types";


describe('PropertyMetadataDecorator', () => {
    const TestMetadataManager = MetadataManagerClass();
    const Property = PropertyMetadataDecoratorFn(TestMetadataManager);
    
    class TestTarget {
        @Property({ a: 1 })
        propertyA!: string;

        @Property({ b: 2 })
        propertyB!: string;
    }

    it('should save the expected metadata', () => {
        const expected: MetadataDict = {
            propertyA: { a: 1 },
            propertyB: { b: 2 }
        };

        expect(TestMetadataManager.getMetadata(TestTarget.prototype)).toMatchObject(expected);
    });
});


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
});