/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from "class-validator";
import { PropertyKey } from "dist/packages/metadata-manager";
import { random } from 'radash';


export class Id extends String {
    static isId(value: unknown): value is Id {
        return typeof value === 'string' && value.length > 0;
    }

    static fake() {
        return random(1, Number.MAX_SAFE_INTEGER) + '';
    }
}

export type IdConstructor = typeof Id;


export function IsId(validationOptions?: ValidationOptions) {
  return function (target: Object, propertyKey: PropertyKey) {
    registerDecorator({
      name: 'isId',
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      validator: {
        validate(value) {
          return Id.isId(value);
        },
      },
    });
  };
}
