/**
 * Reports whether `value` is a number less than or equal to zero. This includes `0` and `-0`.
 *
 * @example
 * isNonPositive(0);
 */
export function isNonPositive(value: unknown): boolean {
    return typeof value === "number" && value <= 0;
}
