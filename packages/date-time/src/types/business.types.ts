import type { ConfiguredHoliday } from "./configured-holiday.types.js";
import type { DateInput } from "./date-input.types.js";
import type { TimeRange, Weekday } from "./time.types.js";

/**
 * Which days and hours count as working time.
 *
 * A holiday entry is `{ date, name? }`. A bare `DateInput` is a holiday
 * with no name. A date-only string is that calendar date in `timeZone`.
 */
export interface BusinessCalendar {
    /**
     * ISO weekdays that count as business days. Every other weekday is a weekend.
     *
     * @defaultValue `[1, 2, 3, 4, 5]`
     */
    workingDays?: readonly Weekday[] | undefined;
    /**
     * Dates that are closed.
     *
     * A list is matched by the calendar day in `timeZone`.
     *
     * @defaultValue `[]`
     */
    holidays?: readonly (ConfiguredHoliday | DateInput)[] | undefined;
    /**
     * Working windows for a business day. An empty list means the whole day.
     *
     * @defaultValue `[{ start: "09:00", end: "17:00" }]`
     */
    businessHours?: readonly TimeRange[] | undefined;
    /**
     * IANA time zone or fixed offset the calendar uses.
     *
     * @defaultValue The system time zone.
     */
    timeZone?: string | undefined;
}
