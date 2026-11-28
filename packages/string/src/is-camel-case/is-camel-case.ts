import { toCamelCase } from "../to-camel-case/to-camel-case.js";
import { splitIntoUnits } from "../utils/units.utils.js";

/** Punctuation or whitespace. Camel case has none. */
const separatorExpression = /[\p{P}\p{Z}\s]/u;

/**
 * Reports whether `value` is already camelCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isCamelCase("value");
 */
export function isCamelCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (separatorExpression.test(value)) {
        return false;
    }
    if (toCamelCase(value) !== value) {
        return false;
    }

    const first = splitIntoUnits(value, "grapheme")[0];
    if (
        first === undefined ||
        first !== first.toLocaleLowerCase() ||
        first === first.toLocaleUpperCase()
    ) {
        return false;
    }
    return true;
}
