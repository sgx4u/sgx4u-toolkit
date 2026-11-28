import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { assertTimeZoneName, readDateParts } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getUTCOffset}.
 */
export interface GetUTCOffsetParams {
    /**
     * The instant to measure.
     */
    date: DateInput;
    /**
     * An IANA name or a fixed offset.
     */
    timeZone: string;
}

/**
 * Returns the offset from UTC, in minutes, for an instant in a zone.
 *
 * The value may include a fraction when the historical offset is not a
 * whole minute. Positive means the zone is ahead of UTC.
 *
 * @param params - `date` and `timeZone` are required.
 * @returns Minutes east of UTC, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `timeZone` is not usable.
 * @example
 * getUTCOffset({ date: "2024-06-15T12:00:00Z", timeZone: "Asia/Kolkata" }); // 330
 */
export function getUTCOffset({
    date,
    timeZone,
}: GetUTCOffsetParams): number | undefined {
    const instant = readDateInput(date, timeZone);
    if (instant === undefined) {
        return undefined;
    }
    const zone = assertTimeZoneName(timeZone, "timeZone");
    return readDateParts(instant.getTime(), zone).offsetMinutes;
}
