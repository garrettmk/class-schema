import { Constructor } from '@garrettmk/ts-utils';
import { MetadataManagerClass } from '../lib/metadata-manager';
import { propertyDecoratorFn } from '../lib/util/property-decorator-fn';

type TestMetaField = {
  nullable?: boolean;
};

type TestMeta = Record<string | symbol, TestMetaField>;


describe('Integration', () => {
  class Manager extends MetadataManagerClass<TestMeta, Constructor>() {}
  class OtherManager extends MetadataManagerClass<TestMeta, Constructor>() {}
  const Field = propertyDecoratorFn(Manager);
  const OtherField = propertyDecoratorFn(OtherManager);

  class TestClass {
    @OtherField({ nullable: true })
    @Field({ nullable: false })
    someField!: string;
  }

  it('should have metadata', () => {
    // const meta = Manager.getOwnMeta(TestClass);
    expect(Manager.hasMetadata(TestClass)).toBeTruthy();
  });
});
