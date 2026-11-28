import { readBoolean, readEnum } from "../utils/assertions.utils.js";
import { getCollator } from "../utils/intl-cache.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { CompareStringsOptions } from "./compare-strings.types.js";

const sensitivities = ["base", "accent", "case", "variant"] as const;

/**
 * Compares two strings with `Intl.Collator`.
 *
 * The result is -1, 0, or 1. A non-string returns `undefined`, so this is
 * not a drop-in `Array#sort` comparator when an input may be invalid.
 * The inputs are not changed.
 *
 * @param options - `first`, `second`, `locale`, `numeric`, and `sensitivity`.
 * @returns The comparison, or `undefined` when an input is not a string.
 * @example
 * compareStrings({ first: "a", second: "b" });
 */
export function compareStrings(
    options: CompareStringsOptions,
): -1 | 0 | 1 | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        locale: readLocale(record.locale),
        numeric: readBoolean("numeric", record.numeric, false),
        sensitivity: readEnum(
            "sensitivity",
            record.sensitivity,
            sensitivities,
            "variant",
        ),
    }));
    if (
        resolved === undefined ||
        typeof resolved.record.first !== "string" ||
        typeof resolved.record.second !== "string"
    )
        return undefined;
    const compared = getCollator(
        resolved.options.locale,
        resolved.options.sensitivity,
        resolved.options.numeric,
    ).compare(resolved.record.first, resolved.record.second);
    return compared < 0 ? -1 : compared > 0 ? 1 : 0;
}
