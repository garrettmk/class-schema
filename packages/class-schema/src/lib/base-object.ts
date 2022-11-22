import { PropertiesMetadataManager } from "./class-schema-types";
import { Constructor } from "./util/types";
import { transformAndValidate, transformAndValidateSync } from "class-transformer-validator";


export abstract class BaseObject {
    static getSchema<T extends BaseObject>(this: Constructor<T>) {
      return PropertiesMetadataManager.getMetadata(this);
    }
  
    static async from<T extends BaseObject>(this: Constructor<T>, data: T): Promise<T> {
      return transformAndValidate(this, data);
    }
  
    static fromSync<T extends BaseObject>(this: Constructor<T>, data: T): T {
      return transformAndValidateSync(this, data);
    }
  
    static fake<T extends BaseObject>(this: Constructor<T>): T {
      const metadata = PropertiesMetadataManager.getMetadata(this);
  
      const fakeValues = Object.entries(metadata).reduce(
        (result, [propertyKey, propertyMetadata]) => {
          if (propertyMetadata.faker)
            result[propertyKey as keyof T] = propertyMetadata.faker() as T[keyof T];
  
          return result;
        },
        {} as T
      );

      return transformAndValidateSync(this, fakeValues);
    }
  }
  