import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatDateWithStyleOptions } from "./format-date-with-style.types.js";

/**
 * Formats a date with `Intl` date and time styles.
 *
 * When neither style is set, `dateStyle` is `"medium"`. `calendar`,
 * `numberingSystem`, and `hourCycle` are passed through to `Intl`.
 *
 * @param date - The instant to format.
 * @param options - Styles and locale. `dateStyle` defaults to `"medium"`.
 * @returns The localized text.
 * @throws {@link RangeError} When `date` is not a real date or the zone is unusable.
 * @example
 * formatDateWithStyle("2026-11-26T00:00:00Z", { timeZone: "UTC", locale: "en-US" }); // "Nov 26, 2026"
 */
export function formatDateWithStyle(
    date: DateInput,
    options?: FormatDateWithStyleOptions,
): string {
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date");
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
    return new Intl.DateTimeFormat(options?.locale, formatOptions).format(
        instant,
    );
}
