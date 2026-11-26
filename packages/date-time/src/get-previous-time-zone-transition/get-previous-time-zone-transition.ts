import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneTransition } from "../types/time-zone.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import { transitionsBetween } from "../utils/transition.utils.js";

const searchWindow = 2 * 365.25 * 86_400_000;

/**
 * Fields for {@link getPreviousTimeZoneTransition}.
 */
export interface GetPreviousTimeZoneTransitionParams {
    /**
     * The instant to search from. A transition at this exact instant is not returned.
     */
    date: DateInput;
    /**
     * An IANA name or a fixed offset.
     */
    timeZone: string;
}

/**
 * Returns the previous offset change, searching up to two years back.
 *
 * @param params - `date` and `timeZone` are required.
 * @returns The transition, or `undefined` when none occurs within two years.
 * @throws {@link RangeError} When the zone is unknown or `date` is not a real date.
 * @example
 * getPreviousTimeZoneTransition({
 *   date: "2024-03-11T00:00:00Z",
 *   timeZone: "America/New_York",
 * })?.instant.toISOString(); // "2024-03-10T07:00:00.000Z"
 */
export function getPreviousTimeZoneTransition({
    date,
    timeZone,
}: GetPreviousTimeZoneTransitionParams): TimeZoneTransition | undefined {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    const end = resolveDateInput(date, "date").getTime();
    const transitions = transitionsBetween(end - searchWindow, end, zone);
    return transitions[transitions.length - 1];
}