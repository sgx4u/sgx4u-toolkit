import { readBoolean, readRequiredString } from "../utils/assertions.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { foldSearchText } from "../utils/search.utils.js";
import type { CountOccurrencesOptions } from "./count-occurrences.types.js";

/**
 * Counts how many times `search` occurs in `value`.
 *
 * An empty search returns 0. `overlap` allows matches to share characters.
 * A non-string returns `undefined`. The input is not changed.
 *
 * @param options - `value`, `search`, and the count options.
 * @returns The count, or `undefined` when `value` is not a string.
 * @example
 * countOccurrences({ value: "aaa", search: "aa", overlap: true });
 */
export function countOccurrences(
    options: CountOccurrencesOptions,
): number | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        search: readRequiredString("search", record.search),
        overlap: readBoolean("overlap", record.overlap, false),
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, false),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const haystack = foldSearchText(
        resolved.record.value,
        resolved.options.ignoreCase,
        resolved.options.locale,
    );
    const needle = foldSearchText(
        resolved.options.search,
        resolved.options.ignoreCase,
        resolved.options.locale,
    );
    if (needle.length === 0) return 0;
    let count = 0;
    let index = 0;
    while (index <= haystack.length - needle.length) {
        if (haystack.startsWith(needle, index)) {
            count += 1;
            index += resolved.options.overlap ? 1 : needle.length;
        } else {
            index += 1;
        }
    }
    return count;
}
