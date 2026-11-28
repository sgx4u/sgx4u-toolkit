/**
 * Converts a safe integer, an integer string, or a bigint to a bigint. Non-integers and other strings return `undefined`.
 *
 * @example
 * toBigInt("42");
 */
export function toBigInt(value: number | string | bigint): bigint | undefined {
    if (typeof value === "bigint") {
        return value;
    }
    if (typeof value === "number") {
        return Number.isSafeInteger(value) ? BigInt(value) : undefined;
    }
    const text = value.trim();
    if (!/^[+-]?\d+$/.test(text)) {
        return undefined;
    }
    return BigInt(text);
}
