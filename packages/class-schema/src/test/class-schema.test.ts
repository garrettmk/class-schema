import { ClassMetadataManager } from '../lib/class-schema-types';
import { ClassMeta, PropertyMeta } from '../lib/class-schema-decorators';

@ClassMeta({ description: 'A test class' })
class TestClass {
  @PropertyMeta({ type: () => String })
  name!: string;
}

describe('TestClass', () => {
  it('should have class metadata', () => {
    const meta = ClassMetadataManager.getMetadata(TestClass);
    console.log(meta);
    expect(meta).toBeDefined();
  });
});
