
export type GenerateNumberOptions = {
    min?: number
    max?: number
    decimals?: number
}

export function generateNumber(options?: GenerateNumberOptions): number {
    const { min = 0, max = 1, decimals } = options ?? {};
    const diff = Math.abs(max - min); 
    const offset = Math.random() * diff;
    const num = min + offset;

    if (decimals !== undefined) {
        return Math.floor(num * 10**decimals) / 10**decimals;
    }

    return num;
}