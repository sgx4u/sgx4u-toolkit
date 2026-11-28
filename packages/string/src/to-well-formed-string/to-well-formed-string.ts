/**
 * Replaces lone surrogates the way `String.prototype.toWellFormed` does.
 *
 * A well-formed string is returned unchanged. The input is not changed.
 *
 * @param value - The text to repair.
 * @returns The well-formed string, or `undefined` when `value` is not a string.
 * @example
 * toWellFormedString("ok");
 */
export function toWellFormedString(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return value.toWellFormed();
}
