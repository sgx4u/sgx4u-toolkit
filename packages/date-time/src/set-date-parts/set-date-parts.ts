import type { DateInput } from "../types/date-input.types.js";
import type { DatePartsInput } from "../types/time.types.js";
import type { AddDurationOptions } from "../add-duration/add-duration.types.js";
import { setPartsOnInstant } from "../utils/arithmetic.utils.js";
import { assertInteger, assertIntegerInRange } from "../utils/assert.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import {
    resolveDisambiguation,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Returns a date with some wall-clock fields replaced.
 *
 * Omitted fields stay as they are in `timeZone`. A day that does not exist
 * in the resulting month is clamped, or rejected when `overflow` is
 * `"reject"`.
 *
 * @param date - The starting instant.
 * @param parts - The fields to replace.
 * @param options - `overflow` defaults to `"constrain"`. `disambiguation` defaults to `"compatible"`.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `parts` has the wrong type.
 * @throws {@link RangeError} When a field is out of range or a `"reject"` option hits a missing time.
 * @example
 * setDateParts("2026-01-15T00:00:00Z", { day: 31 }, { timeZone: "UTC" }).toISOString(); // "2026-01-31T00:00:00.000Z"
 */
export function setDateParts(
    date: DateInput,
    parts: Partial<DatePartsInput>,
    options?: AddDurationOptions,
): Date {
    if (parts === null || typeof parts !== "object" || Array.isArray(parts)) {
        throw typeError("parts", "an object of date fields", parts);
    }
    const overflow = options?.overflow ?? "constrain";
    if (overflow !== "constrain" && overflow !== "reject") {
        throw rangeError("overflow", `"constrain" or "reject"`, overflow);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const checked = checkedParts(parts);
    return new Date(
        setPartsOnInstant(
            resolveDateInput(date, "date", timeZone).getTime(),
            checked,
            timeZone,
            resolveDisambiguation(options?.disambiguation),
            overflow,
        ),
    );
}

/**
 * @param parts - The fields the caller wants to replace.
 * @returns Those fields, each checked when it was provided.
 */
function checkedParts(parts: Partial<DatePartsInput>): Partial<DatePartsInput> {
    const checked: Partial<DatePartsInput> = {};
    if (parts.year !== undefined) {
        checked.year = assertInteger(parts.year, "parts.year");
    }
    if (parts.month !== undefined) {
        checked.month = assertIntegerInRange(parts.month, "parts.month", 1, 12);
    }
    if (parts.day !== undefined) {
        checked.day = assertIntegerInRange(parts.day, "parts.day", 1, 31);
    }
    if (parts.hour !== undefined) {
        checked.hour = assertIntegerInRange(parts.hour, "parts.hour", 0, 23);
    }
    if (parts.minute !== undefined) {
        checked.minute = assertIntegerInRange(
            parts.minute,
            "parts.minute",
            0,
            59,
        );
    }
    if (parts.second !== undefined) {
        checked.second = assertIntegerInRange(
            parts.second,
            "parts.second",
            0,
            59,
        );
    }
    if (parts.millisecond !== undefined) {
        checked.millisecond = assertIntegerInRange(
            parts.millisecond,
            "parts.millisecond",
            0,
            999,
        );
    }
    return checked;
}
