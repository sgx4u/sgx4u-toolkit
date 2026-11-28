/**
 * Reports whether every code point in `value` is in the range 0 through 127.
 *
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string matches.
 * @example
 * isASCII("abc");
 */
export function isASCII(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    for (let index = 0; index < value.length; index += 1) {
        if (value.charCodeAt(index) > 127) {
            return false;
        }
    }
    return true;
}
