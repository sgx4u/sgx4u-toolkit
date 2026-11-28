import { matchesBase64Text } from "../is-base64/is-base64.js";

/**
 * Reports whether `value` is URL-safe Base64.
 *
 * The alphabet is `A-Za-z0-9-_`. Padding characters are rejected, including
 * a correct `=` tail. `+` and `/` are rejected. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is URL-safe Base64.
 * @example
 * isBase64URL("aGk");
 */
export function isBase64URL(value: unknown): boolean {
    return (
        typeof value === "string" &&
        !value.includes("=") &&
        matchesBase64Text(value, true, "optional")
    );
}
