import type { DatePartsInput } from "../types/time.types.js";
import { isRealGregorianDay } from "../utils/gregorian.utils.js";
import {
    completeDateParts,
    instantFromWallTime,
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { CreateDateParams } from "./create-date.types.js";

/**
 * Builds the instant for wall-clock fields in a time zone.
 *
 * Omitted fields use their minimum: month `1`, day `1`, and time `0`.
 * The day must exist; this function does not move it into the next month.
 * A skipped or repeated time follows `disambiguation`.
 *
 * @param params - At least `year`. Other fields, `timeZone`, and `disambiguation` are optional.
 * @returns A new `Date` at that instant, or `undefined` when the parts are not usable.
 * @throws {@link RangeError} When `timeZone` is unusable, `disambiguation` is not a known mode, or `"reject"` hits a gap or overlap.
 * @example
 * createDate({
 *   year: 2026,
 *   month: 11,
 *   day: 26,
 *   hour: 9,
 *   timeZone: "Asia/Kolkata",
 * })?.toISOString(); // "2026-11-26T03:30:00.000Z"
 */
export function createDate({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timeZone,
    disambiguation,
}: CreateDateParams): Date | undefined {
    const completed = readValidatedParts({
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
    });
    if (completed === undefined) {
        return undefined;
    }
    const zone = resolveTimeZone(timeZone);
    const resolvedDisambiguation = resolveDisambiguation(disambiguation);
    return new Date(
        instantFromWallTime(completed, zone, resolvedDisambiguation),
    );
}

/**
 * @param parts - The caller's fields.
 * @returns Every field, checked and filled in, or `undefined` when invalid.
 */
function readValidatedParts(
    parts: DatePartsInput,
): Required<DatePartsInput> | undefined {
    if (parts === null || typeof parts !== "object" || Array.isArray(parts)) {
        return undefined;
    }
    if (!Object.hasOwn(parts, "year")) {
        return undefined;
    }
    if (
        typeof parts.year !== "number" ||
        !Number.isFinite(parts.year) ||
        !Number.isInteger(parts.year)
    ) {
        return undefined;
    }
    const year = parts.year;
    if (
        !readIntegerInRange(parts.month ?? 1, 1, 12) ||
        !readIntegerInRange(parts.day ?? 1, 1, 31) ||
        !readIntegerInRange(parts.hour ?? 0, 0, 23) ||
        !readIntegerInRange(parts.minute ?? 0, 0, 59) ||
        !readIntegerInRange(parts.second ?? 0, 0, 59) ||
        !readIntegerInRange(parts.millisecond ?? 0, 0, 999)
    ) {
        return undefined;
    }
    const month = parts.month ?? 1;
    const day = parts.day ?? 1;
    const hour = parts.hour ?? 0;
    const minute = parts.minute ?? 0;
    const second = parts.second ?? 0;
    const millisecond = parts.millisecond ?? 0;
    if (!isRealGregorianDay(year, month, day)) {
        return undefined;
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

/**
 * @param value - A candidate integer.
 * @param minimum - Smallest allowed value.
 * @param maximum - Largest allowed value.
 * @returns `true` when `value` is an integer in the range.
 */
function readIntegerInRange(
    value: unknown,
    minimum: number,
    maximum: number,
): boolean {
    if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        !Number.isInteger(value)
    ) {
        return false;
    }
    return value >= minimum && value <= maximum;
}
