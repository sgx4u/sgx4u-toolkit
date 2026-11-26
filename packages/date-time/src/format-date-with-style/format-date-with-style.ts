import { readDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatDateWithStyleParams } from "./format-date-with-style.types.js";

/**
 * Formats a date with `Intl` date and time styles.
 *
 * When neither style is set, `dateStyle` is `"medium"`. `calendar`,
 * `numberingSystem`, and `hourCycle` are passed through to `Intl`.
 *
 * @param params - `date` is required. `dateStyle` defaults to `"medium"`.
 * @returns The localized text, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When the zone is unusable.
 * @example
 * formatDateWithStyle({
 *   date: "2026-11-26T00:00:00Z",
 *   timeZone: "UTC",
 *   locale: "en-US",
 * }); // "Nov 26, 2026"
 */
export function formatDateWithStyle({
    date,
    timeZone,
    locale,
    timeStyle,
    dateStyle,
    calendar,
    numberingSystem,
    hourCycle,
}: FormatDateWithStyleParams): string | undefined {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
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
    return new Intl.DateTimeFormat(locale, formatOptions).format(instant);
}
