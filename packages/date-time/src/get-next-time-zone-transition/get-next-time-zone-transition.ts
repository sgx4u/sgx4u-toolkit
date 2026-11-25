import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneTransition } from "../types/time-zone.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import { transitionsBetween } from "../utils/transition.utils.js";

const searchWindow = 2 * 365.25 * 86_400_000;

/**
 * Returns the next offset change, searching up to two years ahead.
 *
 * @param date - The instant to search from. A transition at this exact instant is not returned.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns The transition, or `undefined` when none occurs within two years.
 * @throws {@link RangeError} When the zone is unknown.
 * @example
 * getNextTimeZoneTransition("2024-03-10T00:00:00Z", "America/New_York")?.instant.toISOString(); // "2024-03-10T07:00:00.000Z"
 */
export function getNextTimeZoneTransition(
    date: DateInput,
    timeZone: string,
): TimeZoneTransition | undefined {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    const start = resolveDateInput(date, "date").getTime();
    return transitionsBetween(start + 1, start + searchWindow, zone)[0];
}
