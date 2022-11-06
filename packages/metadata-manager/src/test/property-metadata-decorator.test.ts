import { MetadataManagerClass } from "src/lib/metadata-manager";
import { PropertyMetadataDecoratorFn } from "src/lib/property-metdata-decorator";
import { MetadataDict } from "src/lib/types";

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
})