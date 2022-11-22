import { ClassMetadata, ClassMetadataManager, PropertiesMetadata, PropertiesMetadataManager, PropertyContext, PropertyMetadata } from "./class-schema-types";
import { Constructor } from "./util/types";
import { transformAndValidate, transformAndValidateSync } from "class-transformer-validator";
import { MetadataAction, entries } from "@garrettmk/metadata-actions";


export type CreateClassOptions = {
  name?: string
  classMetadata?: ClassMetadata
  propertiesMetadata?: PropertiesMetadata
  propertyMetadataActions?: MetadataAction<PropertyMetadata, PropertyContext>[]
}

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

    const fakeValues = entries(metadata).reduce(
      (result, [propertyKey, propertyMetadata]) => {
        if (propertyMetadata.faker)
          result[propertyKey as keyof T] = propertyMetadata.faker() as T[keyof T];

        return result;
      },
      {} as T
    );

    return transformAndValidateSync(this, fakeValues);
  }

  static createClass<T extends object>(options?: CreateClassOptions): BaseObjectConstructor<T> {
    const { name, classMetadata, propertiesMetadata } = options ?? {};
    const generatedClass = class extends BaseObject {};

    if (name)
      Object.defineProperty(generatedClass, 'name', { value: name });

    if (classMetadata)
      ClassMetadataManager.setMetadata(generatedClass, classMetadata);

    if (propertiesMetadata)
      PropertiesMetadataManager.setMetadata(generatedClass, propertiesMetadata);

    return generatedClass as BaseObjectConstructor<T>;
  }
}


export type BaseObjectConstructor<T = never> = T extends never
  ? typeof BaseObject
  : Constructor<T> & typeof BaseObject;