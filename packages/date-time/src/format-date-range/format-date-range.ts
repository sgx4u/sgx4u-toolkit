import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatDateWithStyleOptions } from "../format-date-with-style/format-date-with-style.types.js";

/**
 * Formats two dates as a range, collapsing shared parts.
 *
 * The text comes from `Intl.DateTimeFormat.prototype.formatRange`.
 *
 * @param start - The first instant.
 * @param end - The second instant. It must not be before `start`.
 * @param options - The same styles as `formatDateWithStyle`. `dateStyle` defaults to `"medium"`.
 * @returns The localized range.
 * @throws {@link RangeError} When `start` is after `end`, or a date is invalid.
 * @example
 * formatDateRange("2026-01-03T00:00:00Z", "2026-01-05T00:00:00Z", { timeZone: "UTC", locale: "en-US" });
 */
export function formatDateRange(
    start: DateInput,
    end: DateInput,
    options?: FormatDateWithStyleOptions,
): string {
    const timeZone = resolveTimeZone(options?.timeZone);
    const startDate = resolveDateInput(start, "start");
    const endDate = resolveDateInput(end, "end");
    if (startDate.getTime() > endDate.getTime()) {
        throw rangeError("start", "a date at or before `end`", start);
    }
    const formatOptions: Intl.DateTimeFormatOptions = { timeZone };
    if (options?.timeStyle !== undefined) {
        formatOptions.timeStyle = options.timeStyle;
    }
    if (options?.dateStyle !== undefined) {
        formatOptions.dateStyle = options.dateStyle;
    } else if (options?.timeStyle === undefined) {
        formatOptions.dateStyle = "medium";
    }
    if (options?.calendar !== undefined) {
        formatOptions.calendar = options.calendar;
    }
    if (options?.numberingSystem !== undefined) {
        formatOptions.numberingSystem = options.numberingSystem;
    }
    if (options?.hourCycle !== undefined) {
        formatOptions.hourCycle = options.hourCycle;
    }
    return new Intl.DateTimeFormat(options?.locale, formatOptions).formatRange(
        startDate,
        endDate,
    );
}
