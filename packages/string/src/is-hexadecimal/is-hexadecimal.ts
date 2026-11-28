/**
 * Reports whether `value` is hexadecimal digits with no `0x` prefix.
 *
 * An empty string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when every character is a hex digit.
 * @example
 * isHexadecimal("dead");
 */
export function isHexadecimal(value: unknown): boolean {
    return typeof value === "string" && /^[0-9A-Fa-f]+$/u.test(value);
}
