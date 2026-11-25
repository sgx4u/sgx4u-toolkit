import type { DateInput } from "../types/date-input.types.js";
import type { RelativeTimeParts } from "../types/relative-time.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { chooseRelativeTime } from "../utils/relative-time.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { isTimeUnit } from "../utils/unit.utils.js";
import type { RelativeTimeOptions } from "./get-relative-time-parts.types.js";

/**
 * Returns the signed relative-time value and the unit that was chosen.
 *
 * Negative means the past. `"auto"` never chooses weeks.
 *
 * @param date - The date to describe.
 * @param options - `unit` defaults to `"auto"`. `now` defaults to the current time.
 * @returns The value and the unit.
 * @throws {@link RangeError} When `date` or `unit` is invalid.
 * @example
 * getRelativeTimeParts("2026-01-01T03:00:00Z", { now: "2026-01-01T00:00:00Z" }); // { value: 3, unit: "hour" }
 */
export function getRelativeTimeParts(
    date: DateInput,
    options?: RelativeTimeOptions,
): RelativeTimeParts {
    const unit = options?.unit ?? "auto";
    if (unit !== "auto" && !isTimeUnit(unit)) {
        throw rangeError("unit", 'a time unit or "auto"', unit);
    }
    const timeZone = resolveTimeZone(undefined);
    return chooseRelativeTime(
        resolveDateInput(date, "date").getTime(),
        resolveNow(options?.now).getTime(),
        timeZone,
        unit,
    );
}
