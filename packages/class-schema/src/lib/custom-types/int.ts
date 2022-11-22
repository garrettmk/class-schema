import { random } from "radash";

export class Int extends Number {
    static isInt(value: unknown): value is Int {
        return typeof value === 'number' && (value === Math.floor(value));
    }

    static fake() {
        return random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
}

export type IntConstructor = typeof Int;