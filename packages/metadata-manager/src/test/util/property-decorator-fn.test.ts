import { Constructor } from "@garrettmk/ts-utils";
import { MetadataManagerClass } from "../../lib/metadata-manager"
import { MetadataDict } from "../../lib/types";
import { propertyDecoratorFn } from '../../lib/util/property-decorator-fn';

describe('propertyDecoratorFn', () => {
    const Manager = MetadataManagerClass<MetadataDict<number>, Constructor>();
    const Metadata = propertyDecoratorFn(Manager);

    class SomeClass {
        @Metadata(1)
        one!: number;

        @Metadata(2)
        two!: number;
    }

    const expected = {
        one: 1,
        two: 2
    }

    it('should match the expected metadata', () => {
        const meta = Manager.getMetadata(SomeClass);

        expect(meta).toMatchObject(expected);
    });
})