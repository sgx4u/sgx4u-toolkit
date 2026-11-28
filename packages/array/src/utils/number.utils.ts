import { rangeError, typeError } from "./errors.utils.js";

/**
 * @param value - A candidate integer.
 * @returns `true` when `value` is a finite integer.
 */
export function isFiniteInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value);
}

/**
 * Requires a positive finite integer.
 *
 * A non-number is a type error. A number that is not a positive integer is
 * a range error, including `0`, fractions, and infinities.
 *
 * @param name - Argument name.
 * @param value - The candidate.
 * @returns The validated integer.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is not a positive finite integer.
 */
export function assertPositiveInteger(name: string, value: unknown): number {
    if (typeof value !== "number") {
        throw typeError(name, "a positive finite integer", value);
    }
    if (!Number.isInteger(value) || value < 1) {
        throw rangeError(name, "a positive finite integer", value);
    }
    return value;
}

/**
 * Requires a finite integer greater than or equal to 0.
 *
 * @param name - Argument name.
 * @param value - The candidate.
 * @returns The validated integer.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is negative, fractional, or not finite.
 */
export function assertNonNegativeInteger(name: string, value: unknown): number {
    if (typeof value !== "number") {
        throw typeError(
            name,
            "a finite integer greater than or equal to 0",
            value,
        );
    }
    if (!Number.isInteger(value) || value < 0) {
        throw rangeError(
            name,
            "a finite integer greater than or equal to 0",
            value,
        );
    }
    return value;
}

/**
 * Requires any finite integer, including negatives.
 *
 * @param name - Argument name.
 * @param value - The candidate.
 * @returns The validated integer.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is not a finite integer.
 */
export function assertInteger(name: string, value: unknown): number {
    if (typeof value !== "number") {
        throw typeError(name, "a finite integer", value);
    }
    if (!Number.isInteger(value)) {
        throw rangeError(name, "a finite integer", value);
    }
    return value;
}

/**
 * Requires a finite number.
 *
 * @param name - Argument name.
 * @param value - The candidate.
 * @returns The validated number.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is `NaN` or an infinity.
 */
export function assertFiniteNumber(name: string, value: unknown): number {
    if (typeof value !== "number") {
        throw typeError(name, "a finite number", value);
    }
    if (!Number.isFinite(value)) {
        throw rangeError(name, "a finite number", value);
    }
    return value;
}

/**
 * Positive finite integer, or `Infinity`.
 *
 * Used for async concurrency. `Infinity` means no cap.
 *
 * @param name - Argument name.
 * @param value - The candidate. `undefined` stays `undefined`.
 * @returns The validated limit, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is not `Infinity` or a positive integer.
 */
export function assertConcurrency(
    name: string,
    value: unknown,
): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "number") {
        throw typeError(name, "a positive finite integer or Infinity", value);
    }
    if (value === Number.POSITIVE_INFINITY) {
        return value;
    }
    if (!Number.isInteger(value) || value < 1) {
        throw rangeError(name, "a positive finite integer or Infinity", value);
    }
    return value;
}
