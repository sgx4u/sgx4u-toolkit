/**
 * Reports whether `value` is a ULID.
 *
 * A ULID is 26 Crockford base32 characters: digits, `A` through `H`,
 * `J`, `K`, `M`, `N`, `P` through `T`, and `V` through `Z`. `I`, `L`,
 * `O`, and `U` are excluded. Matching is case-insensitive. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is 26 Crockford characters.
 * @example
 * isULID("01ARZ3NDEKTSV4RRFFQ69G5FAV");
 */
export function isULID(value: unknown): boolean {
    return (
        typeof value === "string" && /^[0-9A-HJKMNP-TV-Z]{26}$/iu.test(value)
    );
}
