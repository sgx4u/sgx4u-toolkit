import type { DateInput } from "../types/date-input.types.js";
import { getRelativeTimeParts } from "../get-relative-time-parts/get-relative-time-parts.js";
import { rangeError } from "../utils/error.utils.js";
import type { FormatRelativeTimeOptions } from "./format-relative-time.types.js";

/**
 * Formats a date as relative time, such as `3 days ago` or `in 2 hours`.
 *
 * The text comes from `Intl.RelativeTimeFormat`.
 *
 * @param date - The date to describe.
 * @param options - `unit` defaults to `"auto"`, `style` to `"long"`, and `numeric` to `"auto"`.
 * @returns The localized text.
 * @throws {@link RangeError} When `date` or an option is invalid.
 * @example
 * formatRelativeTime("2026-01-04T00:00:00Z", { now: "2026-01-01T00:00:00Z", locale: "en" }); // "in 3 days"
 */
export function formatRelativeTime(
    date: DateInput,
    options?: FormatRelativeTimeOptions,
): string {
    const style = options?.style ?? "long";
    const numeric = options?.numeric ?? "auto";
    if (style !== "long" && style !== "short" && style !== "narrow") {
        throw rangeError("style", `"long", "short", or "narrow"`, style);
    }
    if (numeric !== "always" && numeric !== "auto") {
        throw rangeError("numeric", `"always" or "auto"`, numeric);
    }
    const parts = getRelativeTimeParts(date, options);
    if (parts.unit === "millisecond") {
        return new Intl.NumberFormat(options?.locale, {
            style: "unit",
            unit: "millisecond",
            unitDisplay: style,
        }).format(parts.value);
    }
    return new Intl.RelativeTimeFormat(options?.locale, {
        style,
        numeric,
    }).format(parts.value, parts.unit);
}
