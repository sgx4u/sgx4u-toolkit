import type { DatePartsInput } from "../types/time.types.js";
import type { WallTimeStatus } from "../types/time-zone.types.js";
import { rangeError } from "../utils/error.utils.js";
import {
    assertTimeZoneName,
    completeDateParts,
    instantFromWallTime,
} from "../utils/time-zone.utils.js";

/**
 * Reports whether a wall time exists once, never, or twice.
 *
 * @param parts - The wall-clock fields. Omitted fields default to their minimum.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns `"valid"`, `"skipped"`, or `"repeated"`.
 * @throws {@link RangeError} When the zone is unknown or the calendar day does not exist.
 * @example
 * getWallTimeStatus({ year: 2024, month: 3, day: 10, hour: 2, minute: 30 }, "America/New_York"); // "skipped"
 */
export function getWallTimeStatus(
    parts: DatePartsInput,
    timeZone: string,
): WallTimeStatus {
    const zone = assertTimeZoneName(timeZone, "timeZone");
    const complete = completeDateParts(parts);
    try {
        instantFromWallTime(complete, zone, "reject");
        return "valid";
    } catch (error) {
        if (!(error instanceof RangeError)) {
            throw error;
        }
        if (error.message.includes("repeated")) {
            return "repeated";
        }
        if (error.message.includes("skipped")) {
            return "skipped";
        }
        throw rangeError("parts", "a real wall time", parts);
    }
}
