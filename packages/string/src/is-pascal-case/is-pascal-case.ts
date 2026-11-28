import { toPascalCase } from "../to-pascal-case/to-pascal-case.js";
import { splitIntoUnits } from "../utils/units.utils.js";

/** Punctuation or whitespace. Pascal case has none. */
const separatorExpression = /[\p{P}\p{Z}\s]/u;

/**
 * Reports whether `value` is already pascalCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isPascalCase("value");
 */
export function isPascalCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (separatorExpression.test(value)) {
        return false;
    }
    if (toPascalCase(value) !== value) {
        return false;
    }

    const first = splitIntoUnits(value, "grapheme")[0];
    if (
        first === undefined ||
        first !== first.toLocaleUpperCase() ||
        first === first.toLocaleLowerCase()
    ) {
        return false;
    }
    return true;
}
