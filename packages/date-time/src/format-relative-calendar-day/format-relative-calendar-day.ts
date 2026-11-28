import { calendarBoundariesBetween } from "../utils/arithmetic.utils.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import type { FormatRelativeCalendarDayParams } from "./format-relative-calendar-day.types.js";

/**
 * Formats a date as a nearby day plus a time, then as a full date.
 *
 * The same day is "Today at {time}". The previous and next days use the
 * locale's yesterday and tomorrow words. The six days around today use the
 * weekday name and the time. Anything further away uses a medium date and
 * the time.
 *
 * @param params - `date` is required. `timeStyle` defaults to `"short"`.
 * @returns The localized text, or `undefined` when `date` or `now` is not usable.
 * @throws {@link RangeError} When `timeStyle` or `timeZone` is invalid.
 * @example
 * formatRelativeCalendarDay({
 *   date: "2026-01-01T17:00:00Z",
 *   now: "2026-01-02T12:00:00Z",
 *   timeZone: "UTC",
 *   locale: "en",
 * }); // "Yesterday at 5:00 PM"
 */
export function formatRelativeCalendarDay({
    date,
    now,
    timeZone,
    locale,
    timeStyle = "short",
}: FormatRelativeCalendarDayParams): string | undefined {
    if (timeStyle !== "short" && timeStyle !== "medium") {
        throw rangeError("timeStyle", `"short" or "medium"`, timeStyle);
    }
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return undefined;
    }
    const reference =
        now === undefined
            ? resolveNow(undefined, zone)
            : readDateInput(now, zone);
    if (reference === undefined) {
        return undefined;
    }
    const dayDifference = calendarBoundariesBetween(
        instant.getTime(),
        reference.getTime(),
        "day",
        zone,
        1,
    );
    const time = new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        timeStyle,
    }).format(instant);
    if (dayDifference >= -1 && dayDifference <= 1) {
        const dayWord = new Intl.RelativeTimeFormat(locale, {
            numeric: "auto",
        }).format(dayDifference, "day");
        return `${capitalize(dayWord)} at ${time}`;
    }
    if (dayDifference >= -6 && dayDifference <= 6) {
        const weekday = new Intl.DateTimeFormat(locale, {
            timeZone: zone,
            weekday: "long",
        }).format(instant);
        return `${weekday} at ${time}`;
    }
    return new Intl.DateTimeFormat(locale, {
        timeZone: zone,
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
