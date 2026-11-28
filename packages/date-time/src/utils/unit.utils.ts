import type { TimeUnit } from "../types/time.types.js";
import { calendarUnits, timeUnits } from "../constants/time.constants.js";
import { rangeError, typeError } from "./error.utils.js";

/**
 * @param value - The caller's unit.
 * @param argumentName - The parameter name used in the error.
 * @returns The unit when it is one of the nine time units.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `value` is not a known unit.
 */
export function assertTimeUnit(
    value: unknown,
    argumentName = "unit",
): TimeUnit {
    if (typeof value !== "string") {
        throw typeError(argumentName, "a time unit", value);
    }
    if (!isTimeUnit(value)) {
        throw rangeError(argumentName, "a time unit", value);
    }
    return value;
}

/**
 * @param value - The caller's unit, which may also be `"decade"`.
 * @param argumentName - The parameter name used in the error.
 * @returns The unit when `startOfUnit` and `endOfUnit` accept it.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `value` is not a known boundary unit.
 */
export function assertBoundaryUnit(
    value: unknown,
    argumentName = "unit",
): TimeUnit | "decade" {
    if (value === "decade") {
        return "decade";
    }
    return assertTimeUnit(value, argumentName);
}

/**
 * @param value - A string that might name a unit.
 * @returns `true` when `value` is a {@link TimeUnit}.
 */
export function isTimeUnit(value: string): value is TimeUnit {
    return (timeUnits as readonly string[]).includes(value);
}

/**
 * @param unit - A time unit.
 * @returns `true` for year, quarter, month, week, and day.
 */
export function isCalendarUnit(
    unit: TimeUnit,
): unit is "year" | "quarter" | "month" | "week" | "day" {
    return (calendarUnits as readonly string[]).includes(unit);
}
