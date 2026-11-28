import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { chooseRelativeTime } from "../utils/relative-time.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { isTimeUnit } from "../utils/unit.utils.js";
import type { FormatRelativeTimeParams } from "./format-relative-time.types.js";

/**
 * Formats a date as relative time, such as `3 days ago` or `in 2 hours`.
 *
 * The text comes from `Intl.RelativeTimeFormat`.
 *
 * @param params - `date` is required. `unit` defaults to `"auto"`, `style` to `"long"`, and `numeric` to `"auto"`.
 * @returns The localized text, or `undefined` when `date` or `now` is not usable.
 * @throws {@link RangeError} When `unit`, `style`, or `numeric` is invalid.
 * @example
 * formatRelativeTime({
 *   date: "2026-01-04T00:00:00Z",
 *   now: "2026-01-01T00:00:00Z",
 *   locale: "en",
 * }); // "in 3 days"
 */
export function formatRelativeTime({
    date,
    now,
    unit = "auto",
    style = "long",
    numeric = "auto",
    locale,
}: FormatRelativeTimeParams): string | undefined {
    if (style !== "long" && style !== "short" && style !== "narrow") {
        throw rangeError("style", `"long", "short", or "narrow"`, style);
    }
    if (numeric !== "always" && numeric !== "auto") {
        throw rangeError("numeric", `"always" or "auto"`, numeric);
    }
    if (unit !== "auto" && !isTimeUnit(unit)) {
        throw rangeError("unit", 'a time unit or "auto"', unit);
    }
    const zone = resolveTimeZone(undefined);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const reference =
        now === undefined ? resolveNow(undefined) : readDateInput(now, zone);
    if (reference === undefined) {
        return undefined;
    }
    const parts = chooseRelativeTime(
        instant.getTime(),
        reference.getTime(),
        zone,
        unit,
    );
    if (parts.unit === "millisecond") {
        return new Intl.NumberFormat(locale, {
            style: "unit",
            unit: "millisecond",
            unitDisplay: style,
        }).format(parts.value);
    }
    return new Intl.RelativeTimeFormat(locale, {
        style,
        numeric,
    }).format(parts.value, parts.unit);
}
