/**
 * Reports whether `value` is a finite number.
 *
 * `NaN` and both infinities return `false`.
 *
 * @returns `true` when `Number.isFinite(value)` is `true`.
 * @example
 * isFiniteNumber(1);
 */
export function isFiniteNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}
