import { equalsString } from "../equals-string/equals-string.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { EqualsIgnoreCaseOptions } from "./equals-ignore-case.types.js";

/**
 * Reports whether two strings are equal ignoring case.
 *
 * Accents still matter. The collator sensitivity is `"accent"`, which
 * ignores case and keeps accents. A non-string returns `false`.
 *
 * @param options - `first`, `second`, and an optional `locale`.
 * @returns `true` when the strings match aside from case.
 * @throws {@link TypeError} When `locale` is not a string or a list of strings.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * equalsIgnoreCase({ first: "A", second: "a" });
 */
export function equalsIgnoreCase(options: EqualsIgnoreCaseOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (
        resolved === undefined ||
        typeof resolved.record.first !== "string" ||
        typeof resolved.record.second !== "string"
    ) {
        return false;
    }
    const locale = resolved.options.locale;
    return equalsString({
        first: resolved.record.first,
        second: resolved.record.second,
        sensitivity: "accent",
        ...(locale === undefined ? {} : { locale }),
    });
}
