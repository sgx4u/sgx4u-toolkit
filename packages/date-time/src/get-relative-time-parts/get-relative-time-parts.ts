import type { RelativeTimeParts } from "../types/relative-time.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { chooseRelativeTime } from "../utils/relative-time.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { isTimeUnit } from "../utils/unit.utils.js";
import type { GetRelativeTimePartsParams } from "./get-relative-time-parts.types.js";

/**
 * Returns the signed relative-time value and the unit that was chosen.
 *
 * Negative means the past. `"auto"` never chooses weeks.
 *
 * @param params - `date` is required. `unit` defaults to `"auto"`. `now` defaults to the current time.
 * @returns The value and the unit, or `undefined` when `date` or `now` is not usable.
 * @throws {@link RangeError} When `unit` is invalid.
 * @example
 * getRelativeTimeParts({
 *   date: "2026-01-01T03:00:00Z",
 *   now: "2026-01-01T00:00:00Z",
 * }); // { value: 3, unit: "hour" }
 */
export function getRelativeTimeParts({
    date,
    unit = "auto",
    now,
}: GetRelativeTimePartsParams): RelativeTimeParts | undefined {
    if (unit !== "auto" && !isTimeUnit(unit)) {
        throw rangeError("unit", 'a time unit or "auto"', unit);
    }
    const timeZone = resolveTimeZone(undefined);
    const instant = readDateInput(date);
    if (instant === undefined) {
        return undefined;
    }
    const reference = now === undefined ? resolveNow(undefined) : readDateInput(now);
    if (reference === undefined) {
        return undefined;
    }
    return chooseRelativeTime(
        instant.getTime(),
        reference.getTime(),
        timeZone,
        unit,
    );
}