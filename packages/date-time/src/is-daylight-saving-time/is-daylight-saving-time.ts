import type { DateInput } from "../types/date-input.types.js";
import { getUTCOffset } from "../get-utc-offset/get-utc-offset.js";
import { readDateInput } from "../utils/date-input.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isDaylightSavingTime}.
 */
export interface IsDaylightSavingTimeParams {
    /**
     * The instant to test.
     */
    date: DateInput;
    /**
     * Zone used for the offset comparison.
     */
    timeZone?: string;
}

/**
 * Reports whether an instant is in daylight saving time.
 *
 * Daylight saving means the offset is greater than the smaller of the
 * offsets on 1 January and 1 July of that year in the zone.
 *
 * @param params - `date` is required. `timeZone` defaults to the system zone.
 * @returns `true` when the offset is above the year's standard offset.
 * @throws {@link RangeError} When `timeZone` is unknown.
 * @example
 * isDaylightSavingTime({
 *   date: "2026-01-15T00:00:00Z",
 *   timeZone: "America/New_York",
 * }); // false
 */
export function isDaylightSavingTime({
    date,
    timeZone,
}: IsDaylightSavingTimeParams): boolean {
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return false;
    }
    const year = readDateParts(instant.getTime(), zone).year;
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
            zone,
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
            zone,
            "compatible",
        ),
    );
    const januaryOffset = getUTCOffset({ date: january, timeZone: zone });
    const julyOffset = getUTCOffset({ date: july, timeZone: zone });
    const currentOffset = getUTCOffset({ date: instant, timeZone: zone });
    if (
        januaryOffset === undefined ||
        julyOffset === undefined ||
        currentOffset === undefined
    ) {
        return false;
    }
    const standard = Math.min(januaryOffset, julyOffset);
    return currentOffset > standard;
}