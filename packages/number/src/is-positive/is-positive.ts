/**
 * Reports whether `value` is a number greater than zero. Zero, `-0`, `NaN`, and non-numbers return `false`.
 *
 * @example
 * isPositive(1);
 */
export function isPositive(value: unknown): boolean {
    return typeof value === "number" && value > 0;
}
