
export class Float extends Number {
    static isFloat(value: unknown): value is Float {
        return typeof value === 'number' && (value === Math.floor(value));
    }

    static fake() {
        return Math.random();
    }
}

export type FloatConstructor = typeof Float;