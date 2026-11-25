import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { getUtcOffset } from "../get-utc-offset/get-utc-offset.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Reports whether an instant is in daylight saving time.
 *
 * Daylight saving means the offset is greater than the smaller of the
 * offsets on 1 January and 1 July of that year in the zone.
 *
 * @param date - The instant to test.
 * @param options - `timeZone` defaults to the system zone.
 * @returns `true` when the offset is above the year's standard offset.
 * @throws {@link RangeError} When `date` is not a real date or the zone is unknown.
 * @example
 * isDaylightSavingTime("2026-01-15T00:00:00Z", { timeZone: "America/New_York" }); // false
 */
export function isDaylightSavingTime(
    date: DateInput,
    options?: TimeZoneOptions,
): boolean {
    const timeZone = resolveTimeZone(options?.timeZone);
    const instant = resolveDateInput(date, "date", timeZone);
    const year = readDateParts(instant.getTime(), timeZone).year;
    const january = new Date(
        instantFromWallTime(
            {
                year,
                month: 1,
                day: 1,
                hour: 12,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            timeZone,
            "compatible",
        ),
    );
    const july = new Date(
        instantFromWallTime(
            {
                year,
                month: 7,
                day: 1,
                hour: 12,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            timeZone,
            "compatible",
        ),
    );
    const standard = Math.min(
        getUtcOffset(january, timeZone),
        getUtcOffset(july, timeZone),
    );
    return getUtcOffset(instant, timeZone) > standard;
}
