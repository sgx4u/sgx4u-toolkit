/**
 * Reports whether `value` is a BIC, also called a SWIFT code.
 *
 * The form is 8 or 11 characters: four bank letters, two country letters,
 * two location characters that are letters or digits, and an optional
 * three-character branch. Matching is case-insensitive. Spaces are
 * rejected. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` has that shape.
 * @example
 * isBIC("DEUTDEFF");
 */
export function isBIC(value: unknown): boolean {
    return (
        typeof value === "string" &&
        /^[A-Za-z]{4}[A-Za-z]{2}[A-Za-z0-9]{2}(?:[A-Za-z0-9]{3})?$/u.test(value)
    );
}
