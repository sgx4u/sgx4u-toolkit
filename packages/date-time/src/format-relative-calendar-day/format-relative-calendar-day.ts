import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { calendarBoundariesBetween } from "../utils/arithmetic.utils.js";
import type { FormatRelativeCalendarDayOptions } from "./format-relative-calendar-day.types.js";

/**
 * Formats a date as a nearby day plus a time, then as a full date.
 *
 * The same day is "Today at {time}". The previous and next days use the
 * locale's yesterday and tomorrow words. The six days around today use the
 * weekday name and the time. Anything further away uses a medium date and
 * the time.
 *
 * @param date - The date to describe.
 * @param options - `timeStyle` defaults to `"short"`.
 * @returns The localized text.
 * @throws {@link RangeError} When `date` or `timeStyle` is invalid.
 * @example
 * formatRelativeCalendarDay("2026-01-01T17:00:00Z", { now: "2026-01-02T12:00:00Z", timeZone: "UTC", locale: "en" }); // "Yesterday at 5:00 PM"
 */
export function formatRelativeCalendarDay(
    date: DateInput,
    options?: FormatRelativeCalendarDayOptions,
): string {
    const timeStyle = options?.timeStyle ?? "short";
    if (timeStyle !== "short" && timeStyle !== "medium") {
        throw rangeError("timeStyle", `"short" or "medium"`, timeStyle);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date", timeZone);
    const now = resolveNow(options?.now, timeZone);
    const dayDifference = calendarBoundariesBetween(
        instant.getTime(),
        now.getTime(),
        "day",
        timeZone,
        1,
    );
    const time = new Intl.DateTimeFormat(options?.locale, {
        timeZone,
        timeStyle,
    }).format(instant);
    if (dayDifference >= -1 && dayDifference <= 1) {
        const dayWord = new Intl.RelativeTimeFormat(options?.locale, {
            numeric: "auto",
        }).format(dayDifference, "day");
        return `${capitalize(dayWord)} at ${time}`;
    }
    if (dayDifference >= -6 && dayDifference <= 6) {
        const weekday = new Intl.DateTimeFormat(options?.locale, {
            timeZone,
            weekday: "long",
        }).format(instant);
        return `${weekday} at ${time}`;
    }
    return new Intl.DateTimeFormat(options?.locale, {
        timeZone,
        dateStyle: "medium",
        timeStyle,
    }).format(instant);
}

/**
 * @param text - A relative day word.
 * @returns The same word with the first character uppercased.
 */
function capitalize(text: string): string {
    const first = text.slice(0, 1).toLocaleUpperCase();
    return `${first}${text.slice(1)}`;
}
