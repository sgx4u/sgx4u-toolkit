import { roundInstant } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertBoundaryUnit } from "../utils/unit.utils.js";
import type { TimeUnit } from "../types/time.types.js";
import type { RoundToUnitParams } from "./round-to-unit.types.js";

/**
 * Rounds a date to a unit increment.
 *
 * For minutes the increment must be one of 1, 2, 3, 4, 5, 6, 10, 12, 15,
 * 20, or 30. `"nearest"` at the exact halfway point moves away from the
 * earlier boundary.
 *
 * @param params - `date` and `unit` are required. `increment` defaults to `1` and `mode` to `"nearest"`.
 * @returns A new `Date`, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When `increment` does not divide the next clock unit, `unit` is unknown, `mode` is unknown, or `timeZone` is invalid.
 * @example
 * roundToUnit({ date: "2024-06-15T10:07:30Z", unit: "minute", timeZone: "UTC", increment: 15 })?.toISOString(); // "2024-06-15T10:15:00.000Z"
 */
export function roundToUnit({
    date,
    unit,
    timeZone,
    increment = 1,
    mode = "nearest",
}: RoundToUnitParams): Date | undefined {
    if (mode !== "nearest" && mode !== "down" && mode !== "up") {
        throw rangeError("mode", `"nearest", "down", or "up"`, mode);
    }
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const boundaryUnit = assertBoundaryUnit(unit);
    return new Date(
        roundInstant(
            resolved.getTime(),
            boundaryUnit as TimeUnit,
            zone,
            1,
            increment,
            mode,
        ),
    );
}
