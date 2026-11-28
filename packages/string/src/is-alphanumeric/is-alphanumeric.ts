import { readOptionalString } from "../utils/assertions.utils.js";
import { letterGraphemePattern } from "../utils/letter-script.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { IsAlphanumericOptions } from "./is-alphanumeric.types.js";

/**
 * Reports whether every grapheme is a letter or a decimal digit.
 *
 * The locale rule matches `isAlpha`, and digits are allowed as well.
 * An empty string returns `false`. The input is not changed.
 *
 * @param value - The string to test.
 * @returns `true` when every grapheme is a letter or digit.
 * @throws {@link TypeError} When `locale` is present and is not a string.
 * @example
 * isAlphanumeric("abc123");
 */
export function isAlphanumeric(value: unknown): boolean;
/**
 * @param options - `value` and an optional `locale`.
 * @returns `true` when every grapheme is a letter or digit.
 */
export function isAlphanumeric(options: IsAlphanumericOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns `true` when every grapheme is a letter or digit.
 */
export function isAlphanumeric(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLetterLocale(record.locale),
    }));
    if (resolved === undefined || resolved.value.length === 0) {
        return false;
    }
    const pattern = letterGraphemePattern(resolved.options.locale, true);
    if (resolved.options.locale === "ascii") {
        return pattern.test(resolved.value);
    }
    return splitIntoUnits(resolved.value, "grapheme").every((grapheme) =>
        pattern.test(grapheme),
    );
}

/**
 * Reads the optional locale and rejects an empty string.
 *
 * @param value - The `locale` option.
 * @returns The locale, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a string.
 * @throws {@link RangeError} When `value` is `""`.
 */
function readLetterLocale(value: unknown): string | undefined {
    const locale = readOptionalString("locale", value);
    if (locale === "") {
        throw new RangeError('locale must be a non-empty string. Received "".');
    }
    return locale;
}
