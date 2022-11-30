import { Constructor } from "@garrettmk/ts-utils";
import { MetadataManagerClass } from "../../lib/metadata-manager"
import { MetadataDict } from "../../lib/types";
import { classDecoratorFn } from '../../lib/util/class-decorator-fn';

describe('classDecoratorFn', () => {
    const Manager = MetadataManagerClass<MetadataDict, Constructor>();
    const Metadata = classDecoratorFn(Manager);
    const expected = { hello: 'there' };

    @Metadata(expected)
    class SomeClass {}

    it('should assign the given metadata to the class', () => {
        const meta = Manager.getMetadata(SomeClass);

        expect(meta).toMatchObject(meta);
    });
})