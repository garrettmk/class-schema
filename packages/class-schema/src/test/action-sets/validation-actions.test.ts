import { BaseObject } from "../../lib/base-object";
import { Class, Property } from "../../lib/class-schema-decorators";
import { Id } from "../../lib/custom-types/id";

describe('validation-actions', () => {
    describe('id fields', () => {
        @Class()
        class TestObject extends BaseObject {
            @Property(() => String, { optional: true })
            id!: string;
        }

        it('should validate', async () => {
            await expect(TestObject.from({} as TestObject)).resolves.toBeInstanceOf(TestObject);
        });
    });
});