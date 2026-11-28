import { splitIntoUnits } from "../utils/units.utils.js";

/**
 * Reports whether the first grapheme of `value` is an uppercase letter.
 *
 * Later characters are ignored. An empty string returns `false`. The
 * input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the first grapheme is upper case.
 * @example
 * isCapitalized("Hello");
 */
export function isCapitalized(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    const first = splitIntoUnits(value, "grapheme")[0];
    if (first === undefined) {
        return false;
    }
    return (
        first === first.toLocaleUpperCase() &&
        first !== first.toLocaleLowerCase()
    );
}
