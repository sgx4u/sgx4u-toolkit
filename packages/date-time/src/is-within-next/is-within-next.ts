import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { isNegativeDuration, readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isWithinNext}.
 */
export interface IsWithinNextParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * How far ahead to look. It must not be negative.
     */
    duration: Duration;
    /**
     * The instant to use instead of the current time.
     */
    now?: DateInput;
    /**
     * Zone used when calendar units move the window.
     */
    timeZone?: string;
}

/**
 * Reports whether a date is between now and now plus a duration.
 *
 * Both ends are included. Calendar units in the duration are applied in
 * the zone.
 *
 * @param params - `date` and `duration` are required.
 * @returns `true` when `date` is inside the window.
 * @throws {@link RangeError} When `duration` is negative.
 * @example
 * isWithinNext({
 *   date: "2026-01-01T12:00:00Z",
 *   duration: { hours: 24 },
 *   now: "2026-01-01T00:00:00Z",
 *   timeZone: "UTC",
 * }); // true
 */
export function isWithinNext({
    date,
    duration,
    now,
    timeZone,
}: IsWithinNextParams): boolean {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return false;
    }
    if (isNegativeDuration(checked)) {
        throw rangeError("duration", "a zero or positive duration", duration);
    }
    const zone = resolveTimeZone(timeZone);
    const instant = readDateInput(date, zone);
    if (instant === undefined) {
        return false;
    }
    const current =
        now === undefined ? resolveNow(undefined, zone) : readDateInput(now, zone);
    if (current === undefined) {
        return false;
    }
    const later = addDuration({
        date: current,
        duration: checked,
        timeZone: zone,
    });
    if (later === undefined) {
        return false;
    }
    const instantTime = instant.getTime();
    const nowTime = current.getTime();
    return instantTime >= nowTime && instantTime <= later.getTime();
}