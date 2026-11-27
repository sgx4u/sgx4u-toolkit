/**
 * Reports whether `value` is an integer number.
 *
 * @returns `true` when `Number.isInteger(value)` is `true`.
 * @example
 * isInteger(2);
 */
export function isInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value);
}
