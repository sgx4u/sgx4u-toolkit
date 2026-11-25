import { isDateValue } from "./date-value.utils.js";
import { parseStrictDateString } from "./date-string.utils.js";
import { rangeError, typeError } from "./error.utils.js";
import { utcEpochMilliseconds } from "./gregorian.utils.js";
import { instantFromWallTime, resolveTimeZone } from "./time-zone.utils.js";

const maximumTimeValue = 8_640_000_000_000_000;

/**
 * A new `Date` for a `DateInput`.
 *
 * A date-only string is midnight in `timeZone`. A date-time string keeps
 * the offset written in the text. The input date is not mutated, and the
 * result is always a different object.
 *
 * @param value - The caller's date.
 * @param argumentName - The parameter name used in an error.
 * @param timeZone - Zone for a date-only string. Omit it to use the system zone.
 * @returns A new `Date` at that instant.
 * @throws {@link TypeError} When `value` is not a `Date`, number, or string.
 * @throws {@link RangeError} When `value` is not a real date, or the zone is not usable.
 */
export function resolveDateInput(
    value: unknown,
    argumentName: string,
    timeZone?: string,
): Date {
    if (isDateValue(value)) {
        const timeValue = readTimeValue(value);
        if (!Number.isFinite(timeValue)) {
            throw new RangeError(
                `\`${argumentName}\` must be a valid date; received Invalid Date.`,
            );
        }
        return dateFromTimeValue(timeValue, argumentName);
    }
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw rangeError(argumentName, "a valid date", value);
        }
        return dateFromTimeValue(value, argumentName);
    }
    if (typeof value === "string") {
        return dateFromStrictString(value, argumentName, timeZone);
    }
    throw typeError(
        argumentName,
        "a Date, a millisecond timestamp, or a date string",
        value,
    );
}

/**
 * The instant a function should treat as now.
 *
 * @param now - The caller's override, or `undefined` to read `Date.now()`.
 * @param timeZone - Zone for a date-only override.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `now` has the wrong type.
 * @throws {@link RangeError} When `now` is not a real date.
 */
export function resolveNow(now: unknown, timeZone?: string): Date {
    if (now === undefined) {
        return new Date(Date.now());
    }
    return resolveDateInput(now, "now", timeZone);
}

/**
 * Whether `value` is a real date, without throwing.
 *
 * A `Date` from another realm counts when its time value is finite. A
 * string counts when `parseStrictDateString` accepts it, including an
 * offset written without a colon.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a real date.
 */
export function isRealDate(value: unknown): boolean {
    try {
        if (isDateValue(value)) {
            return Number.isFinite(value.getTime());
        }
    } catch {
        return false;
    }
    if (typeof value === "number") {
        return (
            Number.isFinite(value) && Number.isFinite(new Date(value).getTime())
        );
    }
    if (typeof value === "string") {
        return parseStrictDateString(value) !== undefined;
    }
    return false;
}

/**
 * @param date - A Date object, possibly from another realm.
 * @returns Its time value, or `NaN` when `getTime` throws.
 */
function readTimeValue(date: Date): number {
    try {
        return date.getTime();
    } catch {
        return Number.NaN;
    }
}

/**
 * @param timeValue - Unix time in milliseconds.
 * @param argumentName - The parameter name used when the instant cannot be stored.
 * @returns A new `Date`.
 * @throws {@link RangeError} When `timeValue` is not a finite instant `Date` can store.
 */
function dateFromTimeValue(timeValue: number, argumentName: string): Date {
    if (!Number.isFinite(timeValue) || Math.abs(timeValue) > maximumTimeValue) {
        throw rangeError(argumentName, "a valid date", timeValue);
    }
    const date = new Date(timeValue);
    if (!Number.isFinite(date.getTime())) {
        throw rangeError(argumentName, "a valid date", timeValue);
    }
    return date;
}

/**
 * @param value - A strict date string.
 * @param argumentName - The parameter name used when the text is not a real date.
 * @param timeZone - Zone for a calendar date.
 * @returns The instant the string names.
 * @throws {@link RangeError} When the text is not a real date.
 */
function dateFromStrictString(
    value: string,
    argumentName: string,
    timeZone: string | undefined,
): Date {
    const parsed = parseStrictDateString(value);
    if (parsed === undefined) {
        throw rangeError(argumentName, "a valid date", value);
    }
    if (parsed.offsetMinutes !== undefined) {
        const utcEpoch = utcEpochMilliseconds(
            parsed.year,
            parsed.month - 1,
            parsed.day,
            parsed.hour,
            parsed.minute,
            parsed.second,
            parsed.millisecond,
        );
        return dateFromTimeValue(
            utcEpoch - parsed.offsetMinutes * 60_000,
            argumentName,
        );
    }
    const zone = resolveTimeZone(timeZone);
    return new Date(
        instantFromWallTime(
            {
                year: parsed.year,
                month: parsed.month,
                day: parsed.day,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            zone,
            "compatible",
        ),
    );
}
