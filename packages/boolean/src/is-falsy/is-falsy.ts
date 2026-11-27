/**
 * Reports whether `value` is falsy under JavaScript `ToBoolean`.
 *
 * `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN` return
 * `true`. Every other value returns `false`, including the string
 * `"false"` and a boxed boolean. The function never throws. It does not
 * special-case `document.all`; a host that treats that object as falsy
 * already makes `!value` true.
 *
 * @param value - Any value. Every value has a truthiness.
 * @returns `true` when `value` is falsy.
 * @example
 * isFalsy(0); // true
 */
export function isFalsy(value: unknown): boolean {
    return !value;
}
