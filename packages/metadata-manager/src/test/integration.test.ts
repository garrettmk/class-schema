import { MetadataManagerClass } from '../lib/metadata-manager';
import { PropertyMetadataDecoratorFn } from '../lib/metadata-decorators';

type TestMetaField = {
  nullable?: boolean;
};

type TestMeta = Record<string | symbol, TestMetaField>;

// eslint-disable-next-line @typescript-eslint/ban-types
type MetaTarget = Object | Function;

describe('Integration', () => {
  class Manager extends MetadataManagerClass<TestMeta, MetaTarget>() {}
  class OtherManager extends MetadataManagerClass<TestMeta, MetaTarget>() {}
  const Field = PropertyMetadataDecoratorFn(Manager);
  const OtherField = PropertyMetadataDecoratorFn(OtherManager);

  class TestClass {
    @OtherField({ nullable: true })
    @Field({ nullable: false })
    someField!: string;
  }

  it('should have metadata', () => {
    console.log(Manager.getMetadata(TestClass.prototype));
    console.log(OtherManager.getMetadata(TestClass.prototype));
    // const meta = Manager.getOwnMeta(TestClass);
    expect(Manager.hasMetadata(TestClass.prototype)).toBeTruthy();
  });
});
