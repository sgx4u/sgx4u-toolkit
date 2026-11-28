/**
 * Reports whether `value` is a safe integer.
 *
 * Safe integers are exactly representable from
 * `Number.MIN_SAFE_INTEGER` through `Number.MAX_SAFE_INTEGER`.
 *
 * @returns `true` when `Number.isSafeInteger(value)` is `true`.
 * @example
 * isSafeInteger(1);
 */
export function isSafeInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value);
}
