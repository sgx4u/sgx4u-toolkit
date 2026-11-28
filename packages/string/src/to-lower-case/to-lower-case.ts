import { readLocale, localeForIntl } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { ToLowerCaseOptions } from "./to-lower-case.types.js";

/**
 * Returns `value` converted with `toLocaleLowerCase`.
 *
 * The locale is read on each call. The input is not changed.
 *
 * @param value - The text to convert.
 * @returns The converted string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `locale` is not a string or a list of strings.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * toLowerCase("Hello");
 */
export function toLowerCase(value: string): string | undefined;
/**
 * @param options - `value` and an optional `locale`.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toLowerCase(options: ToLowerCaseOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toLowerCase(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return resolved.value.toLocaleLowerCase(
        localeForIntl(resolved.options.locale),
    );
}
