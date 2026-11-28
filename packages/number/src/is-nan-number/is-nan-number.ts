/**
 * Reports whether `value` is the number `NaN`.
 *
 * The name avoids the global `isNaN`, which coerces its argument.
 * `"NaN"` and `undefined` return `false`.
 *
 * @returns `true` only for the number `NaN`.
 * @example
 * isNaNNumber(Number.NaN);
 */
export function isNaNNumber(value: unknown): boolean {
    return typeof value === "number" && Number.isNaN(value);
}
