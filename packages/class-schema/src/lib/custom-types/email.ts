import { isEmail } from "class-validator"
import { faker } from "@faker-js/faker";

export class Email extends String {
    static isEmail(value: unknown): value is Email {
        return typeof value === 'string' && isEmail(value);
    }

    static fake() {
        return faker.internet.email();
    }
}

export type EmailConstructor = typeof Email;