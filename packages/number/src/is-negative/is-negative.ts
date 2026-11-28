/**
 * Reports whether `value` is a number less than zero. Zero, `-0`, and non-numbers return `false`.
 *
 * @example
 * isNegative(-1);
 */
export function isNegative(value: unknown): boolean {
    return typeof value === "number" && value < 0;
}
