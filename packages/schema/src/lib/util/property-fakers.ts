import { faker } from "@faker-js/faker";
import { BooleanPropertyMetadata, StringPropertyMetadata } from "../class-schema-types";
import { fakerMaker } from "./faker-maker";
import { TypeFn } from "./types";
import { random } from "radash";


export function booleanFieldFaker(metadata: BooleanPropertyMetadata): TypeFn<boolean> {
    return fakerMaker(metadata, faker.datatype.boolean);
}

export function stringFieldFaker(metadata: StringPropertyMetadata): TypeFn<string> {
    const { maxLength, minLength = 0, in: _in } = metadata;
    let fakerFn: TypeFn;
    
    if (_in)
        fakerFn = () => faker.helpers.arrayElement(_in);
    
    else
        fakerFn = () => {
                const length = maxLength !== undefined ? random(minLength, maxLength) : undefined;
                return faker.datatype.string(length);
            }
    
    return fakerMaker(metadata, fakerFn);
}
