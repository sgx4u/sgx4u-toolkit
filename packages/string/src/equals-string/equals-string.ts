import { readEnum } from "../utils/assertions.utils.js";
import { getCollator } from "../utils/intl-cache.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { EqualsStringOptions } from "./equals-string.types.js";

const sensitivities = ["base", "accent", "case", "variant"] as const;

/**
 * Reports whether two strings are equal under `Intl.Collator`.
 *
 * The default sensitivity is `"variant"`, so case and accents both matter.
 * Either argument not being a string returns `false`. The inputs are not changed.
 *
 * @param options - `first`, `second`, `sensitivity`, and `locale`.
 * @returns `true` when the collator compares them as equal.
 * @throws {@link RangeError} When `sensitivity` is unknown.
 * @example
 * equalsString({ first: "a", second: "a" });
 */
export function equalsString(options: EqualsStringOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        sensitivity: readEnum(
            "sensitivity",
            record.sensitivity,
            sensitivities,
            "variant",
        ),
        locale: readLocale(record.locale),
    }));
    if (
        resolved === undefined ||
        typeof resolved.record.first !== "string" ||
        typeof resolved.record.second !== "string"
    ) {
        return false;
    }
    return (
        getCollator(
            resolved.options.locale,
            resolved.options.sensitivity,
            false,
        ).compare(resolved.record.first, resolved.record.second) === 0
    );
}
