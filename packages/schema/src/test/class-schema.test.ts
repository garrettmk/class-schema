import { ClassMeta, ClassMetadataManager, FieldMeta } from '../lib/class-schema-types';


@ClassMeta({ description: 'A test class' })
class TestClass {
    @FieldMeta({ type: () => String })
    name!: string;
}


describe('TestClass', () => {
    it('should have class metadata', () => {
        const meta = ClassMetadataManager.getMetadata(TestClass);
        console.log(meta);
        expect(meta).toBeDefined();
    })
})