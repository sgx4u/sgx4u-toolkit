import type { DateInput } from "../types/date-input.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { roundInstant } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { RoundToUnitOptions } from "./round-to-unit.types.js";

/**
 * Rounds a date to a unit increment.
 *
 * For minutes the increment must be one of 1, 2, 3, 4, 5, 6, 10, 12, 15,
 * 20, or 30. `"nearest"` at the exact halfway point moves away from the
 * earlier boundary.
 *
 * @param date - The instant to round.
 * @param unit - The unit to round to.
 * @param options - `increment` defaults to `1` and `mode` to `"nearest"`.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `date` or `unit` has the wrong type.
 * @throws {@link RangeError} When `increment` does not divide the next clock unit, or a value is invalid.
 * @example
 * roundToUnit("2024-06-15T10:07:30Z", "minute", { timeZone: "UTC", increment: 15 }).toISOString(); // "2024-06-15T10:15:00.000Z"
 */
export function roundToUnit(
    date: DateInput,
    unit: TimeUnit,
    options?: RoundToUnitOptions,
): Date {
    const mode = options?.mode ?? "nearest";
    if (mode !== "nearest" && mode !== "down" && mode !== "up") {
        throw rangeError("mode", `"nearest", "down", or "up"`, mode);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    return new Date(
        roundInstant(
            resolveDateInput(date, "date", timeZone).getTime(),
            assertTimeUnit(unit),
            timeZone,
            1,
            options?.increment ?? 1,
            mode,
        ),
    );
}
