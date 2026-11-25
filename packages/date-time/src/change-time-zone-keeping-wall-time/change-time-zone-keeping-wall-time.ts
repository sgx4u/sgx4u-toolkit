import type { DateInput } from "../types/date-input.types.js";
import type { DisambiguationOptions } from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import {
    assertTimeZoneName,
    instantFromWallTime,
    readDateParts,
    resolveDisambiguation,
} from "../utils/time-zone.utils.js";

/**
 * Keeps the clock reading and moves it into another time zone.
 *
 * A 09:00 meeting in Kolkata becomes 09:00 in London, which is a different instant.
 *
 * @param date - The original instant.
 * @param fromTimeZone - The zone the clock reading is taken from.
 * @param toTimeZone - The zone that should show the same clock reading.
 * @param options - `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date`.
 * @throws {@link RangeError} When a zone is unknown or `"reject"` hits a gap or overlap.
 * @example
 * changeTimeZoneKeepingWallTime("2026-11-26T03:30:00+05:30", "Asia/Kolkata", "UTC").toISOString(); // "2026-11-26T03:30:00.000Z"
 */
export function changeTimeZoneKeepingWallTime(
    date: DateInput,
    fromTimeZone: string,
    toTimeZone: string,
    options?: DisambiguationOptions,
): Date {
    const source = assertTimeZoneName(fromTimeZone, "fromTimeZone");
    const target = assertTimeZoneName(toTimeZone, "toTimeZone");
    const parts = readDateParts(
        resolveDateInput(date, "date", source).getTime(),
        source,
    );
    return new Date(
        instantFromWallTime(
            parts,
            target,
            resolveDisambiguation(options?.disambiguation),
        ),
    );
}
