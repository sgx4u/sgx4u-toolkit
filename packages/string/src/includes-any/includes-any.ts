import { includes } from "../includes/includes.js";
import { readBoolean } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { IncludesAnyOptions } from "./includes-any.types.js";

/**
 * Reports whether `value` contains any string in `searches`.
 *
 * An empty `searches` list returns `false`. A non-string `value` returns
 * `false`. A non-string entry throws. The input is not changed.
 *
 * @param options - `value` and `searches`.
 * @returns `true` when one search occurs.
 * @throws {@link TypeError} When `searches` is not an array of strings.
 * @example
 * includesAny({ value: "hello", searches: ["x", "ell"] });
 */
export function includesAny(options: IncludesAnyOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        searches: readSearches(record.searches),
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, false),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return false;
    }
    const value = resolved.record.value;
    const locale = resolved.options.locale;
    return resolved.options.searches.some((search) =>
        includes({
            value,
            search,
            ignoreCase: resolved.options.ignoreCase,
            ...(locale === undefined ? {} : { locale }),
        }),
    );
}

/**
 * Reads `searches` as an array of strings.
 *
 * @param value - The option value.
 * @returns The search strings.
 * @throws {@link TypeError} When `value` is not an array of strings.
 */
function readSearches(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
        throw new TypeError(
            `searches must be an array of strings. Received ${describeReceived(value)}.`,
        );
    }
    const searches: string[] = [];
    for (const search of value) {
        if (typeof search !== "string") {
            throw new TypeError(
                `searches must be an array of strings. Received ${describeReceived(search)}.`,
            );
        }
        searches.push(search);
    }
    return searches;
}
