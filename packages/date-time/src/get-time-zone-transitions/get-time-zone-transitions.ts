import type { Interval } from "../types/interval.types.js";
import type { TimeZoneTransition } from "../types/time-zone.types.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import { transitionsBetween } from "../utils/transition.utils.js";

const maximumSpan = 50 * 365.25 * 86_400_000;

/**
 * Returns every offset change inside an interval.
 *
 * @param interval - The half-open interval to scan.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns The transitions, oldest first.
 * @throws {@link RangeError} When the interval is longer than 50 years or the zone is unknown.
 * @example
 * getTimeZoneTransitions(
 *   { start: new Date("2024-03-10T00:00:00Z"), end: new Date("2024-03-11T00:00:00Z") },
 *   "America/New_York",
 * )[0]?.instant.toISOString(); // "2024-03-10T07:00:00.000Z"
 */
export function getTimeZoneTransitions(
    interval: Interval,
    timeZone: string,
): TimeZoneTransition[] {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    const checked = readInterval(interval);
    const start = checked.start.getTime();
    const end = checked.end.getTime();
    if (end - start > maximumSpan) {
        throw rangeError("interval", "at most 50 years", interval);
    }
    return transitionsBetween(start, end, zone);
}
