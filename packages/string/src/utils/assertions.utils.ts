import { describeReceived } from "./describe-received.utils.js";

/**
 * Whether `value` is a non-null object that is not an array.
 *
 * @param value - Any input.
 * @returns `true` when `value` can be read as a flat options object.
 */
export function isOptionsRecord(
    value: unknown,
): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads an optional string option.
 *
 * @param name - Argument name used in the error.
 * @param value - The option value. `undefined` means the caller omitted it.
 * @returns The string, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a string.
 */
export function readOptionalString(
    name: string,
    value: unknown,
): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError(
            `${name} must be a string. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * Reads a required string option.
 *
 * @param name - Argument name used in the error.
 * @param value - The option value.
 * @returns The string.
 * @throws {@link TypeError} When `value` is not a string.
 */
export function readRequiredString(name: string, value: unknown): string {
    if (typeof value !== "string") {
        throw new TypeError(
            `${name} must be a string. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * Reads a finite number option.
 *
 * @param name - Argument name used in the error.
 * @param value - The option value.
 * @param fallback - Value used when `value` is omitted.
 * @returns The number.
 * @throws {@link TypeError} When `value` is present and is not a number.
 * @throws {@link RangeError} When the number is not finite.
 */
export function readFiniteNumber(
    name: string,
    value: unknown,
    fallback?: number,
): number {
    if (value === undefined) {
        if (fallback === undefined) {
            throw new TypeError(
                `${name} must be a number. Received undefined.`,
            );
        }
        return fallback;
    }
    if (typeof value !== "number") {
        throw new TypeError(
            `${name} must be a number. Received ${describeReceived(value)}.`,
        );
    }
    if (!Number.isFinite(value)) {
        throw new RangeError(
            `${name} must be a finite number. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * Reads an integer inside an inclusive range.
 *
 * @param name - Argument name used in the error.
 * @param value - The option value.
 * @param minimum - Lowest accepted integer.
 * @param maximum - Highest accepted integer. Omit for no upper bound.
 * @param fallback - Value used when `value` is omitted.
 * @returns The integer.
 * @throws {@link TypeError} When `value` is present and is not a number.
 * @throws {@link RangeError} When the number is not an integer in range.
 */
export function readInteger(
    name: string,
    value: unknown,
    minimum: number,
    maximum: number | undefined,
    fallback?: number,
): number {
    const number = readFiniteNumber(name, value, fallback);
    if (!Number.isInteger(number)) {
        throw new RangeError(
            `${name} must be an integer. Received ${describeReceived(number)}.`,
        );
    }
    if (number < minimum || (maximum !== undefined && number > maximum)) {
        const range =
            maximum === undefined
                ? `at least ${minimum}`
                : `from ${minimum} through ${maximum}`;
        throw new RangeError(
            `${name} must be ${range}. Received ${describeReceived(number)}.`,
        );
    }
    return number;
}

/**
 * Reads a string that must be one of `allowed`.
 *
 * @typeParam Value - The accepted string union.
 * @param name - Argument name used in the error.
 * @param value - The option value.
 * @param allowed - Accepted values, in the order used in the error text.
 * @param fallback - Value used when `value` is omitted.
 * @returns The accepted value.
 * @throws {@link TypeError} When `value` is present and is not a string.
 * @throws {@link RangeError} When the string is not one of `allowed`.
 */
export function readEnum<Value extends string>(
    name: string,
    value: unknown,
    allowed: readonly Value[],
    fallback: Value,
): Value {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value !== "string") {
        throw new TypeError(
            `${name} must be a string. Received ${describeReceived(value)}.`,
        );
    }
    if (!allowed.includes(value as Value)) {
        throw new RangeError(
            `${name} must be one of ${allowed.join(", ")}. Received ${JSON.stringify(value)}.`,
        );
    }
    return value as Value;
}

/**
 * Reads a boolean option.
 *
 * @param name - Argument name used in the error.
 * @param value - The option value.
 * @param fallback - Value used when `value` is omitted.
 * @returns The boolean.
 * @throws {@link TypeError} When `value` is present and is not a boolean.
 */
export function readBoolean(
    name: string,
    value: unknown,
    fallback: boolean,
): boolean {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value !== "boolean") {
        throw new TypeError(
            `${name} must be a boolean. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}
