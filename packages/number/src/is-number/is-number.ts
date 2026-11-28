/**
 * Reports whether `value` is a number.
 *
 * `NaN`, `Infinity`, and `-Infinity` are numbers. Use
 * {@link isFiniteNumber} when the value must be usable in arithmetic.
 *
 * @returns `true` when `typeof value` is `"number"`.
 * @example
 * isNumber(1);
 */
export function isNumber(value: unknown): value is number {
    return typeof value === "number";
}
