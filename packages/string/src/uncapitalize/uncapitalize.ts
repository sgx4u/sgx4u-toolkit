import { localeForIntl, readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { UncapitalizeOptions } from "./uncapitalize.types.js";

/**
 * Lowercases the first grapheme of `value` and leaves the rest unchanged.
 *
 * The input is not changed.
 *
 * @param value - The text to change.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * uncapitalize("Hello");
 */
export function uncapitalize(value: string): string | undefined;
/**
 * @param options - `value` and an optional `locale`.
 * @returns The new string, or `undefined` when `value` is not a string.
 */
export function uncapitalize(options: UncapitalizeOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns The new string, or `undefined` when `value` is not a string.
 */
export function uncapitalize(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const graphemes = splitIntoUnits(
        resolved.value,
        "grapheme",
        resolved.options.locale,
    );
    const first = graphemes[0];
    if (first === undefined) {
        return resolved.value;
    }
    return (
        first.toLocaleLowerCase(localeForIntl(resolved.options.locale)) +
        graphemes.slice(1).join("")
    );
}
