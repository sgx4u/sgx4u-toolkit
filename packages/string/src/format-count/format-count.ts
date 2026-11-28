import { describeReceived } from "../utils/describe-received.utils.js";
import {
    formatEnglishCount,
    readCount,
    readEnglishLocale,
} from "../utils/inflection.utils.js";
import { isOptionsRecord } from "../utils/assertions.utils.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
import type { FormatCountOptions } from "./format-count.types.js";

/**
 * Settings after checks have been applied.
 */
interface FormatCountSettings {
    /** A finite count. */
    count: number;
    /** An English locale passed to `Intl.NumberFormat`. */
    locale: LocaleArgument;
}

/**
 * Formats a count and the matching English noun.
 *
 * `1` uses the singular and every other finite count uses the plural. The
 * number is formatted with `Intl.NumberFormat`. The noun is not changed
 * before it is copied into the result, and rule tables are not changed.
 *
 * @param options - The noun, the count, and an optional English locale.
 * @returns Text such as `1 apple` or `2 apples`, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `count` is missing or is not a number, or the argument is not an object.
 * @throws {@link RangeError} When `count` is not finite, or `locale` is not English.
 * @example
 * formatCount({ value: "apple", count: 2 });
 */
export function formatCount(options: FormatCountOptions): string | undefined {
    if (!isOptionsRecord(options)) {
        throw new TypeError(
            `count must be a number. Received ${describeReceived(options)}.`,
        );
    }
    const settings = readFormatCountOptions(options);
    if (typeof options.value !== "string") {
        return undefined;
    }
    return formatEnglishCount(options.value, settings.count, settings.locale);
}

/**
 * @param record - The options object.
 * @returns The checked count and locale.
 */
function readFormatCountOptions(
    record: Record<string, unknown>,
): FormatCountSettings {
    return {
        count: readCount(record.count),
        locale: readEnglishLocale(record.locale),
    };
}
