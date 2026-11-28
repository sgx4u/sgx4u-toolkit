import { localeForIntl, readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { SwapCaseOptions } from "./swap-case.types.js";

/**
 * Swaps the case of every cased character in `value`.
 *
 * Characters that are not cased stay as they are. The input is not changed.
 *
 * @param value - The text to swap.
 * @returns The swapped string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * swapCase("Hello");
 */
export function swapCase(value: string): string | undefined;
/**
 * @param options - `value` and an optional `locale`.
 * @returns The swapped string, or `undefined` when `value` is not a string.
 */
export function swapCase(options: SwapCaseOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns The swapped string, or `undefined` when `value` is not a string.
 */
export function swapCase(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const locales = localeForIntl(resolved.options.locale);
    let swapped = "";
    for (const character of resolved.value) {
        const upper = character.toLocaleUpperCase(locales);
        const lower = character.toLocaleLowerCase(locales);
        if (character === lower && character !== upper) {
            swapped += upper;
        } else if (character === upper && character !== lower) {
            swapped += lower;
        } else {
            swapped += character;
        }
    }
    return swapped;
}
