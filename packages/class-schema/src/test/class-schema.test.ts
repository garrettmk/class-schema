import 'reflect-metadata';
import { ClassMetadataManager } from '../lib/class-schema-types';
import { ClassMeta, PropertyMeta, Validated } from '../lib/class-schema-decorators';
import { transformAndValidate } from 'class-transformer-validator';
import { getMetadataStorage, IsString } from 'class-validator';


@Validated()
class TestClass {
  @PropertyMeta({ type: () => String })
  name!: string;

  // @IsString({ each: false })
  // name2!: string;
}

describe('TestClass', () => {
  it('should have validation metadata', () => {
    const storage = getMetadataStorage();
    const meta = storage.getTargetValidationMetadatas(TestClass, '', true, true);
    console.log(meta);
    expect(meta).toBeDefined();
  });

  it('should not validate', async () => {
    expect.assertions(1);

    await expect(transformAndValidate(TestClass, { })).rejects.toBeInstanceOf(Array);
  });
});
