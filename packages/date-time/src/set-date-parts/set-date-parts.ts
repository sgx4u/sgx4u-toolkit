import type { DateInput } from "../types/date-input.types.js";
import type { DatePartsInput } from "../types/time.types.js";
import type {
    DisambiguationOptions,
    Overflow,
    TimeZoneOptions,
} from "../types/options.types.js";
import { setPartsOnInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import {
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Fields for {@link setDateParts}.
 */
export interface SetDatePartsParams
    extends TimeZoneOptions, DisambiguationOptions {
    /**
     * The starting instant.
     */
    date: DateInput;
    /**
     * The fields to replace.
     */
    parts: Partial<DatePartsInput>;
    /**
     * What to do when the day does not exist in the resulting month.
     *
     * @defaultValue `"constrain"`
     */
    overflow?: Overflow;
}

/**
 * Returns a date with some wall-clock fields replaced.
 *
 * Omitted fields stay as they are in `timeZone`. A day that does not exist
 * in the resulting month is clamped, or rejected when `overflow` is
 * `"reject"`.
 *
 * @param params - `date` and `parts` are required. `overflow` defaults to `"constrain"`. `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date`, or `undefined` when `date` or a part is not usable.
 * @throws {@link TypeError} When `parts` is not an object.
 * @throws {@link RangeError} When `overflow` or `disambiguation` is unknown, or `"reject"` hits a missing time.
 * @example
 * setDateParts({ date: "2026-01-15T00:00:00Z", parts: { day: 31 }, timeZone: "UTC" })?.toISOString(); // "2026-01-31T00:00:00.000Z"
 */
export function setDateParts({
    date,
    parts,
    timeZone,
    disambiguation,
    overflow = "constrain",
}: SetDatePartsParams): Date | undefined {
    if (parts === null || typeof parts !== "object" || Array.isArray(parts)) {
        throw typeError("parts", "an object of date fields", parts);
    }
    if (overflow !== "constrain" && overflow !== "reject") {
        throw rangeError("overflow", `"constrain" or "reject"`, overflow);
    }
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const checked = checkedParts(parts);
    if (checked === undefined) {
        return undefined;
    }
    return new Date(
        setPartsOnInstant(
            resolved.getTime(),
            checked,
            zone,
            resolveDisambiguation(disambiguation),
            overflow,
        ),
    );
}

/**
 * @param parts - The fields the caller wants to replace.
 * @returns Those fields, each checked when it was provided, or `undefined` when a field is invalid.
 */
function checkedParts(
    parts: Partial<DatePartsInput>,
): Partial<DatePartsInput> | undefined {
    const checked: Partial<DatePartsInput> = {};
    if (parts.year !== undefined) {
        if (!Number.isInteger(parts.year)) {
            return undefined;
        }
        checked.year = parts.year;
    }
    if (parts.month !== undefined) {
        if (
            !Number.isInteger(parts.month) ||
            parts.month < 1 ||
            parts.month > 12
        ) {
            return undefined;
        }
        checked.month = parts.month;
    }
    if (parts.day !== undefined) {
        if (!Number.isInteger(parts.day) || parts.day < 1 || parts.day > 31) {
            return undefined;
        }
        checked.day = parts.day;
    }
    if (parts.hour !== undefined) {
        if (
            !Number.isInteger(parts.hour) ||
            parts.hour < 0 ||
            parts.hour > 23
        ) {
            return undefined;
        }
        checked.hour = parts.hour;
    }
    if (parts.minute !== undefined) {
        if (
            !Number.isInteger(parts.minute) ||
            parts.minute < 0 ||
            parts.minute > 59
        ) {
            return undefined;
        }
        checked.minute = parts.minute;
    }
    if (parts.second !== undefined) {
        if (
            !Number.isInteger(parts.second) ||
            parts.second < 0 ||
            parts.second > 59
        ) {
            return undefined;
        }
        checked.second = parts.second;
    }
    if (parts.millisecond !== undefined) {
        if (
            !Number.isInteger(parts.millisecond) ||
            parts.millisecond < 0 ||
            parts.millisecond > 999
        ) {
            return undefined;
        }
        checked.millisecond = parts.millisecond;
    }
    return checked;
}
