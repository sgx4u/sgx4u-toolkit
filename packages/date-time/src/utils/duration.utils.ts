import type { Duration } from "../types/duration.types.js";
import { rangeError, typeError } from "./error.utils.js";

/**
 * Duration fields, largest first.
 */
export const durationFieldNames = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
] as const;

/**
 * One field of a {@link Duration}.
 */
export type DurationFieldName = (typeof durationFieldNames)[number];

const durationFieldRank: Readonly<Record<DurationFieldName, number>> = {
    years: 0,
    months: 1,
    weeks: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6,
    milliseconds: 7,
};

const calendarFieldNames: ReadonlySet<DurationFieldName> = new Set([
    "years",
    "months",
    "weeks",
    "days",
]);

/**
 * Whether `value` is a duration: known fields, finite numbers, one sign.
 *
 * The empty object is a zero duration. A fraction is allowed only on the
 * smallest non-zero field, and only when that field is a clock unit.
 *
 * @param value - Any value.
 * @returns `true` when `value` can be passed to duration functions.
 */
export function isDurationValue(value: unknown): value is Duration {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }
    const record = value as Record<string, unknown>;
    let sign = 0;
    let smallestNonZeroRank = -1;
    let smallestNonZeroField: DurationFieldName | undefined;
    for (const key of Object.keys(record)) {
        if (!isDurationFieldName(key)) {
            return false;
        }
        const fieldValue = record[key];
        if (typeof fieldValue !== "number" || !Number.isFinite(fieldValue)) {
            return false;
        }
        if (fieldValue === 0) {
            continue;
        }
        const fieldSign = Math.sign(fieldValue);
        if (sign !== 0 && fieldSign !== sign) {
            return false;
        }
        sign = fieldSign;
        const rank = durationFieldRank[key];
        if (rank >= smallestNonZeroRank) {
            smallestNonZeroRank = rank;
            smallestNonZeroField = key;
        }
    }
    if (smallestNonZeroField === undefined) {
        return true;
    }
    for (const fieldName of durationFieldNames) {
        const fieldValue = record[fieldName];
        if (typeof fieldValue !== "number" || Number.isInteger(fieldValue)) {
            continue;
        }
        if (
            fieldName !== smallestNonZeroField ||
            calendarFieldNames.has(fieldName)
        ) {
            return false;
        }
    }
    return true;
}

/**
 * @param value - The caller's duration.
 * @param argumentName - The parameter name used in the error.
 * @returns The same object when it is a valid duration.
 * @throws {@link TypeError} When `value` is not a plain object.
 * @throws {@link RangeError} When a field is unknown, not finite, mixed in sign, or fractional in the wrong place.
 */
export function assertDuration(value: unknown, argumentName: string): Duration {
    if (!isDurationValue(value)) {
        if (
            value === null ||
            typeof value !== "object" ||
            Array.isArray(value)
        ) {
            throw typeError(argumentName, "a duration object", value);
        }
        throw rangeError(
            argumentName,
            "a duration whose fields share one sign",
            value,
        );
    }
    return value;
}

/**
 * Elapsed milliseconds of the clock fields.
 *
 * Years, months, weeks, and days are ignored. A fractional hour counts.
 *
 * @param duration - A duration whose clock fields are already valid.
 * @returns The signed clock length in milliseconds.
 */
export function clockMilliseconds(duration: Duration): number {
    return (
        (duration.hours ?? 0) * 3_600_000 +
        (duration.minutes ?? 0) * 60_000 +
        (duration.seconds ?? 0) * 1_000 +
        (duration.milliseconds ?? 0)
    );
}

/**
 * A duration with every present field's sign flipped.
 *
 * @param duration - A valid duration.
 * @returns A new duration. Zero fields stay zero.
 */
export function negatedDuration(duration: Duration): Duration {
    const negated: Duration = {};
    for (const fieldName of durationFieldNames) {
        const fieldValue = duration[fieldName];
        if (fieldValue === undefined) {
            continue;
        }
        if (fieldValue === 0) {
            negated[fieldName] = 0;
            continue;
        }
        negated[fieldName] = -fieldValue;
    }
    return negated;
}

/**
 * Whether any calendar field is non-zero.
 *
 * @param duration - A duration.
 * @returns `true` when years, months, weeks, or days are not zero.
 */
export function hasCalendarUnits(duration: Duration): boolean {
    return (
        (duration.years ?? 0) !== 0 ||
        (duration.months ?? 0) !== 0 ||
        (duration.weeks ?? 0) !== 0 ||
        (duration.days ?? 0) !== 0
    );
}

/**
 * Whether any field is negative.
 *
 * @param duration - A valid duration, so every field shares that sign.
 * @returns `true` when the duration points backward.
 */
export function isNegativeDuration(duration: Duration): boolean {
    for (const fieldName of durationFieldNames) {
        const fieldValue = duration[fieldName];
        if (fieldValue !== undefined && fieldValue < 0) {
            return true;
        }
    }
    return false;
}

/**
 * @param key - An object key.
 * @returns `true` when `key` is a duration field name.
 */
function isDurationFieldName(key: string): key is DurationFieldName {
    return (durationFieldNames as readonly string[]).includes(key);
}
