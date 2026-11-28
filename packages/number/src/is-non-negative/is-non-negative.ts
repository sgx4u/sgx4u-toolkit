/**
 * Reports whether `value` is a number greater than or equal to zero. This includes `0` and `-0`.
 *
 * @example
 * isNonNegative(0);
 */
export function isNonNegative(value: unknown): boolean {
    return typeof value === "number" && value >= 0;
}
