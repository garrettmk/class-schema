import { MetadataAction } from "@garrettmk/metadata-actions";
import { Constructor } from "@garrettmk/ts-utils";
import { transformAndValidate, transformAndValidateSync } from "class-transformer-validator";
import { mapValues, shake } from "radash";
import { ClassMetadata, ClassMetadataManager, ClassPropertyContext, PropertiesMetadata, PropertiesMetadataManager, PropertyMetadata } from "./class-schema-types";


export type CreateClassOptions = {
  name?: string
  classMetadata?: ClassMetadata
  propertiesMetadata?: PropertiesMetadata
  propertyMetadataActions?: MetadataAction<PropertyMetadata, ClassPropertyContext>[]
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

    const fakeValues = shake(mapValues(metadata, (propertyMetadata, propertyKey) =>
      propertyMetadata.faker?.()
    ));

    return transformAndValidateSync(this, fakeValues);
  }

  static createClass<T extends object>(options?: CreateClassOptions): BaseObjectConstructor<T> {
    const { name, classMetadata, propertiesMetadata } = options ?? {};
    const generatedClass = class extends this {};

    if (name)
      Object.defineProperty(generatedClass, 'name', { value: name });

    if (classMetadata)
      ClassMetadataManager.setMetadata(generatedClass, classMetadata);

    if (propertiesMetadata)
      PropertiesMetadataManager.setMetadata(generatedClass, propertiesMetadata);

    return generatedClass as unknown as BaseObjectConstructor<T>;
  }
}


export type BaseObjectConstructor<T extends object = object> = Constructor<T> & typeof BaseObject;