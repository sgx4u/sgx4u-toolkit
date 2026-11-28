/**
 * Reports whether `value` is text that `JSON.parse` accepts.
 *
 * `null`, numbers, and strings are JSON values, so `"null"`, `"123"`, and
 * `"\\"a\\""` return `true`. An empty string and a parse error return
 * `false`. The function does not throw for those inputs. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `JSON.parse` accepts `value`.
 * @example
 * isJSON("{\\"ok\\":true}");
 */
export function isJSON(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
}
