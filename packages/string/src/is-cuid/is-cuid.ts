/**
 * Reports whether `value` is a CUID.
 *
 * The first character is `c` and the other 24 characters are lowercase
 * letters or digits. The length is 25. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a CUID.
 * @example
 * isCUID("ckpqr8xj00000z3zs1m0a1b2c");
 */
export function isCUID(value: unknown): boolean {
    return typeof value === "string" && /^c[a-z0-9]{24}$/u.test(value);
}
