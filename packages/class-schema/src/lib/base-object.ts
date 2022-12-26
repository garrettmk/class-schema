import { Constructor } from "@garrettmk/ts-utils";
import { instanceToPlain } from "class-transformer";
import { transformAndValidate, transformAndValidateSync } from "class-transformer-validator";
import { validate, validateSync, ValidationError } from "class-validator";
import { mapValues, shake } from "radash";
import { ClassMetadataManager } from "./managers/class-metadata-manager";
import { PropertiesMetadataManager } from "./managers/properties-metadata-manager";
import { ClassMetadata, PropertiesMetadata } from "./types";

export type CreateClassOptions = {
  name?: string
  classMetadata?: ClassMetadata
  propertiesMetadata?: PropertiesMetadata
}

export abstract class BaseObject {
  static getClassMetadata(this: BaseObjectConstructor) {
    return ClassMetadataManager.getMetadata(this);
  }

  static getPropertiesMetadata(this: BaseObjectConstructor) {
    return PropertiesMetadataManager.getMetadata(this);
  }

  static validate<T extends BaseObject>(this: BaseObjectConstructor<T>, data: object): Promise<ValidationError[]> {
    return validate(Object.assign(
      // @ts-expect-error abstract class
      new this,
      data
    ));
  }

  static validateSync<T extends BaseObject>(this: BaseObjectConstructor<T>, data: object): ValidationError[] {
    return validateSync(Object.assign(
      // @ts-expect-error abstract class
      new this,
      data
    ));
  }

  static isValid<T extends BaseObject>(this: BaseObjectConstructor<T>, data: object): data is T {
    return this.validateSync(data).length === 0;
  }

  static async from<T extends BaseObject>(this: BaseObjectConstructor<T>, data: T): Promise<T> {
    return transformAndValidate(this, data, {
      transformer: { excludeExtraneousValues: true }
    });
  }

  static fromSync<T extends BaseObject>(this: BaseObjectConstructor<T>, data: T): T {
    return transformAndValidateSync(this, data, {
      transformer: { excludeExtraneousValues: true }
    });
  }

  static async plainFrom<T extends BaseObject>(this: BaseObjectConstructor<T>, data: T): Promise<T> {
    const instance = await this.from(data);
    const result = instanceToPlain(instance, { exposeUnsetFields: false });

    return result as T;
  }

  static plainFromSync<T extends BaseObject>(this: BaseObjectConstructor<T>, data: T): T {
    const instance = this.fromSync(data);
    const result = instanceToPlain(instance, { exposeUnsetFields: false });

    return result as T;
  }


  static fakeValues<T extends BaseObject>(this: BaseObjectConstructor<T>): T {
    const metadata = PropertiesMetadataManager.getMetadata(this);
    const rawValues = shake(mapValues(metadata, propertyMetadata => propertyMetadata.faker?.()));

    return rawValues as T;
  }

  static fakeSync<T extends BaseObject>(this: BaseObjectConstructor<T>): T {
    const fakeValues = this.fakeValues();
    return this.fromSync(fakeValues as T);
  }

  static fake<T extends BaseObject>(this: BaseObjectConstructor<T>): Promise<T> {
    const fakeValues = this.fakeValues();
    return this.from(fakeValues);
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