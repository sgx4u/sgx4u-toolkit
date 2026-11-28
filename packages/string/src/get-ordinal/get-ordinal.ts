import { describeReceived } from "../utils/describe-received.utils.js";
import {
    englishOrdinal,
    readEnglishLocale,
    readOrdinalCount,
} from "../utils/inflection.utils.js";
import { isOptionsRecord } from "../utils/assertions.utils.js";
import type { GetOrdinalOptions } from "./get-ordinal.types.js";

/**
 * Writes an English ordinal such as `1st`, `2nd`, `3rd`, or `11th`.
 *
 * `count` must be a safe integer. The suffix follows the English rule:
 * `11`, `12`, and `13` use `th`. The input object is not changed.
 *
 * @param options - The integer and an optional English locale.
 * @returns The number and its suffix.
 * @throws {@link TypeError} When `count` is missing or is not a number, or the argument is not an object.
 * @throws {@link RangeError} When `count` is not a safe integer, or `locale` is not English.
 * @example
 * getOrdinal({ count: 3 });
 */
export function getOrdinal(options: GetOrdinalOptions): string {
    if (!isOptionsRecord(options)) {
        throw new TypeError(
            `count must be a number. Received ${describeReceived(options)}.`,
        );
    }
    const count = readOrdinalCount(options.count);
    readEnglishLocale(options.locale);
    return englishOrdinal(count);
}
