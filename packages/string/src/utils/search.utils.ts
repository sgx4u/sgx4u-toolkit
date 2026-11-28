import type { StringUnit } from "../types/string-unit.types.js";
import { localeForIntl, type LocaleArgument } from "./locale.utils.js";
import { splitIntoUnits } from "./units.utils.js";

/**
 * Lowercases `value` when `ignoreCase` is set.
 *
 * @param value - The text.
 * @param ignoreCase - Whether to fold case.
 * @param locale - The locale used for folding.
 * @returns The text to search in.
 */
export function foldSearchText(
    value: string,
    ignoreCase: boolean,
    locale: LocaleArgument | undefined,
): string {
    if (!ignoreCase) {
        return value;
    }
    return value.toLocaleLowerCase(localeForIntl(locale));
}

/**
 * Converts a unit index to a code-unit index.
 *
 * @param value - The original text.
 * @param index - The index in `unit`. Negative values are already resolved by the caller.
 * @param unit - The caller's unit.
 * @param locale - Locale for graphemes.
 * @returns The code-unit index, clamped to the string length.
 */
export function unitIndexToCodeUnit(
    value: string,
    index: number,
    unit: StringUnit,
    locale?: LocaleArgument,
): number {
    if (unit === "codeUnit") {
        return Math.min(Math.max(index, 0), value.length);
    }
    const units = splitIntoUnits(value, unit, locale);
    const clamped = Math.min(Math.max(index, 0), units.length);
    return units.slice(0, clamped).join("").length;
}
