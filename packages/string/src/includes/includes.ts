import { readBoolean, readRequiredString } from "../utils/assertions.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { foldSearchText } from "../utils/search.utils.js";
import type { IncludesOptions } from "./includes.types.js";

/**
 * Reports whether `value` contains `search`.
 *
 * A non-string returns `false`. The input is not changed.
 *
 * @param options - `value`, `search`, and case options.
 * @returns `true` when `search` occurs.
 * @example
 * includes({ value: "hello", search: "ell" });
 */
export function includes(options: IncludesOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        search: readRequiredString("search", record.search),
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, false),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return false;
    return foldSearchText(
        resolved.record.value,
        resolved.options.ignoreCase,
        resolved.options.locale,
    ).includes(
        foldSearchText(
            resolved.options.search,
            resolved.options.ignoreCase,
            resolved.options.locale,
        ),
    );
}
