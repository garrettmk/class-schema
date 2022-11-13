import { faker } from "@faker-js/faker";
import { BooleanFieldMetadata, StringFieldMetadata } from "../property-metadata-types";
import { fakerMaker } from "./faker-maker";
import { TypeFn } from "./types";
import { random } from "radash";


export function booleanFieldFaker(metadata: BooleanFieldMetadata): TypeFn {
    return fakerMaker(metadata, faker.datatype.boolean);
}

export function stringFieldFaker(metadata: StringFieldMetadata): TypeFn {
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
