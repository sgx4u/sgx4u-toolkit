import type {
    DisambiguationOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import type { DatePartsInput } from "../types/time.types.js";
import { assertInteger, assertIntegerInRange } from "../utils/assert.utils.js";
import { typeError } from "../utils/error.utils.js";
import { isRealGregorianDay } from "../utils/gregorian.utils.js";
import {
    completeDateParts,
    instantFromWallTime,
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Builds the instant for wall-clock fields in a time zone.
 *
 * Omitted fields use their minimum: month `1`, day `1`, and time `0`.
 * The day must exist; this function does not move it into the next month.
 * A skipped or repeated time follows `disambiguation`.
 *
 * @param parts - At least the year. Other fields are optional.
 * @param options - `timeZone` defaults to the system zone. `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date` at that instant.
 * @throws {@link TypeError} When `parts` is not an object, or a field has the wrong type.
 * @throws {@link RangeError} When a field is out of range, the day does not exist, the zone is unusable, or `"reject"` hits a gap or overlap.
 * @example
 * createDate({ year: 2026, month: 11, day: 26, hour: 9 }, { timeZone: "Asia/Kolkata" }).toISOString(); // "2026-11-26T03:30:00.000Z"
 */
export function createDate(
    parts: DatePartsInput,
    options?: TimeZoneOptions & DisambiguationOptions,
): Date {
    const completed = completeValidatedParts(parts);
    const timeZone = resolveTimeZone(options?.timeZone);
    const disambiguation = resolveDisambiguation(options?.disambiguation);
    return new Date(instantFromWallTime(completed, timeZone, disambiguation));
}

/**
 * @param parts - The caller's fields.
 * @returns Every field, checked and filled in.
 * @throws {@link TypeError} When `parts` is not an object or `year` is missing.
 * @throws {@link RangeError} When a field is out of range or the day does not exist.
 */
function completeValidatedParts(
    parts: DatePartsInput,
): Required<DatePartsInput> {
    if (parts === null || typeof parts !== "object" || Array.isArray(parts)) {
        throw typeError("parts", "an object with a year", parts);
    }
    if (!Object.hasOwn(parts, "year")) {
        throw typeError("parts.year", "a finite number", undefined);
    }
    const year = assertInteger(parts.year, "parts.year");
    const month = assertIntegerInRange(parts.month ?? 1, "parts.month", 1, 12);
    const day = assertIntegerInRange(parts.day ?? 1, "parts.day", 1, 31);
    const hour = assertIntegerInRange(parts.hour ?? 0, "parts.hour", 0, 23);
    const minute = assertIntegerInRange(
        parts.minute ?? 0,
        "parts.minute",
        0,
        59,
    );
    const second = assertIntegerInRange(
        parts.second ?? 0,
        "parts.second",
        0,
        59,
    );
    const millisecond = assertIntegerInRange(
        parts.millisecond ?? 0,
        "parts.millisecond",
        0,
        999,
    );
    if (!isRealGregorianDay(year, month, day)) {
        throw new RangeError(
            `\`parts.day\` must be a real day of ${String(year)}-${String(month).padStart(2, "0")}; received ${String(day)}.`,
        );
    }
    return completeDateParts({
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
    });
}
