import type { DateInput } from "./date-input.types.js";
import type { TimeRange, Weekday } from "./time.types.js";

/**
 * Which days and hours count as working time.
 */
export interface BusinessCalendar {
    /**
     * ISO weekdays that are not business days.
     *
     * @defaultValue `[6, 7]`
     */
    weekendDays?: readonly Weekday[];
    /**
     * Dates that are closed, or a predicate that reports a holiday.
     *
     * A list is matched by the calendar day in `timeZone`.
     *
     * @defaultValue `[]`
     */
    holidays?: readonly DateInput[] | ((date: Date) => boolean);
    /**
     * Working windows for a business day. An empty list means the whole day.
     *
     * @defaultValue `[{ start: "09:00", end: "17:00" }]`
     */
    workingHours?: readonly TimeRange[];
    /**
     * IANA time zone or fixed offset the calendar uses.
     *
     * @defaultValue The system time zone.
     */
    timeZone?: string;
}
