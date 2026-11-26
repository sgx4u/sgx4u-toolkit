import type { DatePartsInput } from "../types/time.types.js";
import type { WallTimeStatus } from "../types/time-zone.types.js";
import { rangeError } from "../utils/error.utils.js";
import {
    assertTimeZoneName,
    completeDateParts,
    instantFromWallTime,
} from "../utils/time-zone.utils.js";

/**
 * Fields for {@link getWallTimeStatus}.
 */
export interface GetWallTimeStatusParams {
    /**
     * The wall-clock fields. Omitted fields default to their minimum.
     */
    parts: DatePartsInput;
    /**
     * An IANA name or a fixed offset.
     */
    timeZone: string;
}

/**
 * Reports whether a wall time exists once, never, or twice.
 *
 * @param params - `parts` and `timeZone` are required.
 * @returns `"valid"`, `"skipped"`, or `"repeated"`.
 * @throws {@link RangeError} When the zone is unknown or the calendar day does not exist.
 * @example
 * getWallTimeStatus({
 *   parts: { year: 2024, month: 3, day: 10, hour: 2, minute: 30 },
 *   timeZone: "America/New_York",
 * }); // "skipped"
 */
export function getWallTimeStatus({
    parts,
    timeZone,
}: GetWallTimeStatusParams): WallTimeStatus {
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