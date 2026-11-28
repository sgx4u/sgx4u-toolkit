/**
 * Reports whether `value` is a slug.
 *
 * A slug is lowercase letters, decimal digits, and single hyphens. It does
 * not start or end with a hyphen. Unicode lowercase letters are letters.
 * Uppercase letters and underscores are rejected. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a slug.
 * @example
 * isSlug("hello-world");
 */
export function isSlug(value: unknown): boolean {
    return (
        typeof value === "string" &&
        /^[\p{Ll}\p{Nd}]+(?:-[\p{Ll}\p{Nd}]+)*$/u.test(value)
    );
}
