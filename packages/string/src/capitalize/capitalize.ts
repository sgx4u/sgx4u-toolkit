import { readBoolean } from "../utils/assertions.utils.js";
import { localeForIntl, readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { CapitalizeOptions } from "./capitalize.types.js";

/**
 * Uppercases the first grapheme of `value`.
 *
 * The rest is lowercased when `restToLowerCase` is true, which is the
 * default. The input is not changed.
 *
 * @param value - The text to capitalize.
 * @returns The capitalized string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * capitalize("hello");
 */
export function capitalize(value: string): string | undefined;
/**
 * @param options - `value`, `locale`, and `restToLowerCase`.
 * @returns The capitalized string, or `undefined` when `value` is not a string.
 */
export function capitalize(options: CapitalizeOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The capitalized string, or `undefined` when `value` is not a string.
 */
export function capitalize(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
        restToLowerCase: readBoolean(
            "restToLowerCase",
            record.restToLowerCase,
            true,
        ),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const locales = localeForIntl(resolved.options.locale);
    const source = resolved.options.restToLowerCase
        ? resolved.value.toLocaleLowerCase(locales)
        : resolved.value;
    const graphemes = splitIntoUnits(
        source,
        "grapheme",
        resolved.options.locale,
    );
    const first = graphemes[0];
    if (first === undefined) {
        return source;
    }
    return first.toLocaleUpperCase(locales) + graphemes.slice(1).join("");
}
