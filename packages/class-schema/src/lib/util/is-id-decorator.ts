/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from "class-validator";
import { PropertyKey } from "dist/packages/metadata-manager";
import { Id } from "../class-schema-types";


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
                }
            }
        })
    }
}