import { readDateInput } from "../utils/date-input.utils.js";
import {
    assertTimeZoneName,
    instantFromWallTime,
    readDateParts,
    resolveDisambiguation,
} from "../utils/time-zone.utils.js";
import type { ChangeTimeZoneKeepingWallTimeParams } from "./change-time-zone-keeping-wall-time.types.js";

/**
 * Keeps the clock reading and moves it into another time zone.
 *
 * A 09:00 meeting in Kolkata becomes 09:00 in London, which is a different instant.
 *
 * @param params - `date`, `fromTimeZone`, `toTimeZone`, and optional `disambiguation`.
 * @returns A new `Date`, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When a zone is unknown, `disambiguation` is not a known mode, or `"reject"` hits a gap or overlap.
 * @example
 * changeTimeZoneKeepingWallTime({
 *   date: "2026-11-26T03:30:00+05:30",
 *   fromTimeZone: "Asia/Kolkata",
 *   toTimeZone: "UTC",
 * })?.toISOString(); // "2026-11-26T03:30:00.000Z"
 */
export function changeTimeZoneKeepingWallTime({
    date,
    fromTimeZone,
    toTimeZone,
    disambiguation,
}: ChangeTimeZoneKeepingWallTimeParams): Date | undefined {
    const source = assertTimeZoneName(fromTimeZone, "fromTimeZone");
    const target = assertTimeZoneName(toTimeZone, "toTimeZone");
    const instant = readDateInput(date, source);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), source);
    return new Date(
        instantFromWallTime(
            parts,
            target,
            resolveDisambiguation(disambiguation),
        ),
    );
}
