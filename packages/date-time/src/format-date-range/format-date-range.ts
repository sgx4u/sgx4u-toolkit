import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatDateRangeParams } from "./format-date-range.types.js";

/**
 * Formats two dates as a range, collapsing shared parts.
 *
 * The text comes from `Intl.DateTimeFormat.prototype.formatRange`.
 *
 * @param params - `start` and `end` are required. `dateStyle` defaults to `"medium"`.
 * @returns The localized range, or `undefined` when either date is not usable.
 * @throws {@link RangeError} When `start` is after `end`, or the zone is unusable.
 * @example
 * formatDateRange({
 *   start: "2026-01-03T00:00:00Z",
 *   end: "2026-01-05T00:00:00Z",
 *   timeZone: "UTC",
 *   locale: "en-US",
 * });
 */
export function formatDateRange({
    start,
    end,
    timeZone,
    locale,
    timeStyle,
    dateStyle,
    calendar,
    numberingSystem,
    hourCycle,
}: FormatDateRangeParams): string | undefined {
    const zone = resolveTimeZone(timeZone);
    const startDate = readDateInput(start, zone);
    const endDate = readDateInput(end, zone);
    if (startDate === undefined || endDate === undefined) {
        return undefined;
    }
    if (startDate.getTime() > endDate.getTime()) {
        throw rangeError("start", "a date at or before `end`", start);
    }
    const formatOptions: Intl.DateTimeFormatOptions = { timeZone: zone };
    if (timeStyle !== undefined) {
        formatOptions.timeStyle = timeStyle;
    }
    if (dateStyle !== undefined) {
        formatOptions.dateStyle = dateStyle;
    } else if (timeStyle === undefined) {
        formatOptions.dateStyle = "medium";
    }
    if (calendar !== undefined) {
        formatOptions.calendar = calendar;
    }
    if (numberingSystem !== undefined) {
        formatOptions.numberingSystem = numberingSystem;
    }
    if (hourCycle !== undefined) {
        formatOptions.hourCycle = hourCycle;
    }
    return new Intl.DateTimeFormat(locale, formatOptions).formatRange(
        startDate,
        endDate,
    );
}
