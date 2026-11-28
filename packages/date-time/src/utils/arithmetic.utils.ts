import {
    clockUnitDivisor,
    millisecondsPerClockUnit,
} from "../constants/time.constants.js";
import type { Duration } from "../types/duration.types.js";
import type { Disambiguation, Overflow } from "../types/options.types.js";
import type { DatePartsInput, TimeUnit, Weekday } from "../types/time.types.js";
import { rangeError } from "./error.utils.js";
import {
    addGregorianDays,
    addGregorianMonths,
    daysInGregorianMonth,
    isRealGregorianDay,
} from "./gregorian.utils.js";
import { clockMilliseconds, hasCalendarUnits } from "./duration.utils.js";
import { instantFromWallTime, readDateParts } from "./time-zone.utils.js";
import { isCalendarUnit } from "./unit.utils.js";

/**
 * How far to round a value that is not on a boundary.
 */
export type RoundMode = "nearest" | "down" | "up";

/**
 * How to turn a fractional unit count into an integer.
 */
export type RoundingMode = "truncate" | "floor" | "ceil" | "round";

/**
 * Adds a duration to an instant.
 *
 * Years and months move the calendar together, then weeks and days, and
 * the result is resolved in the zone. Hours and smaller units are then
 * added as elapsed time, so a daylight-saving day does not change them.
 *
 * @param epochMilliseconds - The starting instant.
 * @param duration - A valid duration.
 * @param timeZone - Zone for the calendar step.
 * @param disambiguation - How to resolve the calendar result.
 * @param overflow - What to do when the day does not exist in the target month.
 * @returns The resulting instant.
 * @throws {@link RangeError} When `overflow` is `"reject"` and the day does not exist, or when `"reject"` hits a gap or overlap.
 */
export function addDurationToInstant(
    epochMilliseconds: number,
    duration: Duration,
    timeZone: string,
    disambiguation: Disambiguation,
    overflow: Overflow,
): number {
    let instant = epochMilliseconds;
    if (hasCalendarUnits(duration)) {
        const parts = readDateParts(epochMilliseconds, timeZone);
        const withMonths = addGregorianMonths(
            parts.year,
            parts.month,
            parts.day,
            (duration.years ?? 0) * 12 + (duration.months ?? 0),
            overflow,
        );
        const withDays = addGregorianDays(
            withMonths.year,
            withMonths.month,
            withMonths.day,
            (duration.weeks ?? 0) * 7 + (duration.days ?? 0),
        );
        instant = instantFromWallTime(
            {
                year: withDays.year,
                month: withDays.month,
                day: withDays.day,
                hour: parts.hour,
                minute: parts.minute,
                second: parts.second,
                millisecond: parts.millisecond,
            },
            timeZone,
            disambiguation,
        );
    }
    return instant + clockMilliseconds(duration);
}

/**
 * Replaces selected wall-clock fields.
 *
 * @param epochMilliseconds - The starting instant.
 * @param parts - Fields to replace. Omitted fields stay as they are.
 * @param timeZone - Zone the fields are read and written in.
 * @param disambiguation - How to resolve the new wall time.
 * @param overflow - What to do when the resulting day does not exist.
 * @returns The resulting instant.
 * @throws {@link RangeError} When a field is out of range, the day does not exist and `overflow` is `"reject"`, or `"reject"` hits a gap or overlap.
 */
export function setPartsOnInstant(
    epochMilliseconds: number,
    parts: Partial<DatePartsInput>,
    timeZone: string,
    disambiguation: Disambiguation,
    overflow: Overflow,
): number {
    const current = readDateParts(epochMilliseconds, timeZone);
    const year = parts.year ?? current.year;
    const month = parts.month ?? current.month;
    let day = parts.day ?? current.day;
    const maximumDay = daysInGregorianMonth(year, month);
    if (!isRealGregorianDay(year, month, day)) {
        if (overflow === "reject" || day < 1 || month < 1 || month > 12) {
            throw new RangeError(
                `\`parts\` must be a real wall time; received ${String(year)}-${String(month)}-${String(day)}.`,
            );
        }
        day = maximumDay;
    }
    return instantFromWallTime(
        {
            year,
            month,
            day,
            hour: parts.hour ?? current.hour,
            minute: parts.minute ?? current.minute,
            second: parts.second ?? current.second,
            millisecond: parts.millisecond ?? current.millisecond,
        },
        timeZone,
        disambiguation,
    );
}

/**
 * First millisecond of the unit that contains an instant.
 *
 * A skipped boundary, such as a midnight that daylight saving removes,
 * moves forward to the first instant that exists.
 *
 * @param epochMilliseconds - The instant to align.
 * @param unit - The unit, or `"decade"`.
 * @param timeZone - Zone the boundary is measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns The aligned instant.
 */
export function startOfInstant(
    epochMilliseconds: number,
    unit: TimeUnit | "decade",
    timeZone: string,
    weekStartsOn: Weekday,
): number {
    if (unit === "millisecond") {
        return epochMilliseconds;
    }
    const parts = readDateParts(epochMilliseconds, timeZone);
    const aligned = alignPartsToUnitStart(parts, unit, weekStartsOn);
    return wallInstantContaining(aligned, timeZone, epochMilliseconds);
}

/**
 * Last millisecond of the unit that contains an instant.
 *
 * @param epochMilliseconds - The instant to align.
 * @param unit - The unit, or `"decade"`.
 * @param timeZone - Zone the boundary is measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns One millisecond before the next unit starts.
 */
export function endOfInstant(
    epochMilliseconds: number,
    unit: TimeUnit | "decade",
    timeZone: string,
    weekStartsOn: Weekday,
): number {
    const start = startOfInstant(
        epochMilliseconds,
        unit,
        timeZone,
        weekStartsOn,
    );
    return nextUnitStart(start, unit, timeZone) - 1;
}

/**
 * Rounds an instant to a unit increment.
 *
 * Clock increments must divide the next larger unit. `"nearest"` at the
 * exact halfway point moves away from the earlier boundary.
 *
 * @param epochMilliseconds - The instant to round.
 * @param unit - The unit to round to.
 * @param timeZone - Zone the boundaries are measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @param increment - A positive integer. `1` rounds to the unit itself.
 * @param mode - `"nearest"`, `"down"`, or `"up"`.
 * @returns The rounded instant.
 * @throws {@link RangeError} When `increment` is not a positive integer or does not divide the next clock unit.
 */
export function roundInstant(
    epochMilliseconds: number,
    unit: TimeUnit,
    timeZone: string,
    weekStartsOn: Weekday,
    increment: number,
    mode: RoundMode,
): number {
    if (!Number.isInteger(increment) || increment < 1) {
        throw rangeError("increment", "a positive integer", increment);
    }
    if (!isCalendarUnit(unit)) {
        const divisor = clockUnitDivisor[unit];
        if (divisor % increment !== 0) {
            throw rangeError(
                "increment",
                `a divisor of ${String(divisor)} for \`${unit}\``,
                increment,
            );
        }
        return roundClockInstant(
            epochMilliseconds,
            unit,
            timeZone,
            increment,
            mode,
        );
    }
    return roundCalendarInstant(
        epochMilliseconds,
        unit,
        timeZone,
        weekStartsOn,
        increment,
        mode,
    );
}

/**
 * Whole units from `earlier` to `later`.
 *
 * Calendar units count on the wall clock. Clock units divide the elapsed
 * milliseconds. `rounding` applies to the leftover fraction.
 *
 * @param laterEpoch - The end instant.
 * @param earlierEpoch - The start instant.
 * @param unit - The unit to count.
 * @param timeZone - Zone for a calendar unit.
 * @param rounding - How to treat the fractional unit.
 * @returns The signed unit count.
 */
export function differenceInInstantUnit(
    laterEpoch: number,
    earlierEpoch: number,
    unit: TimeUnit,
    timeZone: string,
    rounding: RoundingMode,
): number {
    if (!isCalendarUnit(unit)) {
        const elapsed = laterEpoch - earlierEpoch;
        const quotient = elapsed / millisecondsPerClockUnit[unit];
        return applyRounding(quotient, rounding);
    }
    const sign = Math.sign(laterEpoch - earlierEpoch);
    if (sign === 0) {
        return 0;
    }
    const forwardLater = sign > 0 ? laterEpoch : earlierEpoch;
    const forwardEarlier = sign > 0 ? earlierEpoch : laterEpoch;
    const whole = largestFittingUnits(
        forwardEarlier,
        forwardLater,
        unit,
        timeZone,
    );
    const cursor = addWholeUnits(forwardEarlier, unit, whole, timeZone);
    const next = addWholeUnits(forwardEarlier, unit, whole + 1, timeZone);
    const span = next - cursor;
    const fraction = span === 0 ? 0 : (forwardLater - cursor) / span;
    const rounded = applyRounding(whole + fraction, rounding);
    return sign * rounded;
}

const durationFieldByUnit = {
    year: "years",
    quarter: "months",
    month: "months",
    week: "weeks",
    day: "days",
    hour: "hours",
    minute: "minutes",
    second: "seconds",
    millisecond: "milliseconds",
} as const satisfies Record<TimeUnit, keyof Duration>;

/**
 * A duration that adds back from `earlier` to `later`.
 *
 * Units run from `largestUnit` down to `smallestUnit`. The smallest unit
 * is fractional when it is a clock unit, so the elapsed time is exact.
 *
 * @param laterEpoch - The end instant.
 * @param earlierEpoch - The start instant.
 * @param timeZone - Zone the calendar units are measured in.
 * @param largestUnit - The biggest unit in the result.
 * @param smallestUnit - The smallest unit in the result.
 * @returns The broken-down duration.
 * @throws {@link RangeError} When `smallestUnit` is larger than `largestUnit`.
 */
export function durationBetweenInstants(
    laterEpoch: number,
    earlierEpoch: number,
    timeZone: string,
    largestUnit: TimeUnit,
    smallestUnit: TimeUnit,
): Duration {
    const fields = durationFieldsBetween(largestUnit, smallestUnit);
    let cursor = earlierEpoch;
    const duration: Duration = {};
    for (const [index, fieldName] of fields.entries()) {
        const unit = unitForDurationField(fieldName);
        const isLast = index === fields.length - 1;
        if (!isLast || isCalendarUnit(unit)) {
            const whole = differenceInInstantUnit(
                laterEpoch,
                cursor,
                unit,
                timeZone,
                "truncate",
            );
            if (whole !== 0) {
                duration[fieldName] = whole;
                cursor = addDurationToInstant(
                    cursor,
                    { [fieldName]: whole },
                    timeZone,
                    "compatible",
                    "constrain",
                );
            }
            continue;
        }
        if (
            unit !== "hour" &&
            unit !== "minute" &&
            unit !== "second" &&
            unit !== "millisecond"
        ) {
            continue;
        }
        const unitMilliseconds = millisecondsPerClockUnit[unit];
        const amount = (laterEpoch - cursor) / unitMilliseconds;
        if (amount !== 0) {
            duration[fieldName] = amount;
        }
    }
    return duration;
}

/**
 * Calendar boundaries crossed between two instants.
 *
 * December 31 to January 1 is one year, even though almost no time has
 * elapsed. The result is negative when `later` is before `earlier`.
 *
 * @param laterEpoch - The end instant.
 * @param earlierEpoch - The start instant.
 * @param unit - A calendar unit.
 * @param timeZone - Zone the dates are read in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns The signed number of boundaries.
 */
export function calendarBoundariesBetween(
    laterEpoch: number,
    earlierEpoch: number,
    unit: TimeUnit,
    timeZone: string,
    weekStartsOn: Weekday,
): number {
    const later = readDateParts(laterEpoch, timeZone);
    const earlier = readDateParts(earlierEpoch, timeZone);
    if (unit === "year") {
        return later.year - earlier.year;
    }
    if (unit === "quarter") {
        return (
            quarterIndex(later.year, later.month) -
            quarterIndex(earlier.year, earlier.month)
        );
    }
    if (unit === "month") {
        return (later.year - earlier.year) * 12 + (later.month - earlier.month);
    }
    if (unit === "week") {
        const laterStart = startOfInstant(
            laterEpoch,
            "week",
            timeZone,
            weekStartsOn,
        );
        const earlierStart = startOfInstant(
            earlierEpoch,
            "week",
            timeZone,
            weekStartsOn,
        );
        return Math.round((laterStart - earlierStart) / (7 * 86_400_000));
    }
    const laterStart = startOfInstant(
        laterEpoch,
        "day",
        timeZone,
        weekStartsOn,
    );
    const earlierStart = startOfInstant(
        earlierEpoch,
        "day",
        timeZone,
        weekStartsOn,
    );
    return Math.round((laterStart - earlierStart) / 86_400_000);
}

/**
 * @param parts - Wall-clock fields of the instant.
 * @param unit - The unit whose start is required.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns Fields of the first millisecond of that unit. The day is real.
 */
function alignPartsToUnitStart(
    parts: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        weekday: Weekday;
    },
    unit: TimeUnit | "decade",
    weekStartsOn: Weekday,
): Required<DatePartsInput> {
    let year = parts.year;
    let month = parts.month;
    let day = parts.day;
    let hour = parts.hour;
    let minute = parts.minute;
    let second = parts.second;
    if (unit === "second") {
        return { year, month, day, hour, minute, second, millisecond: 0 };
    }
    if (unit === "minute") {
        return { year, month, day, hour, minute, second: 0, millisecond: 0 };
    }
    if (unit === "hour") {
        return {
            year,
            month,
            day,
            hour,
            minute: 0,
            second: 0,
            millisecond: 0,
        };
    }
    hour = 0;
    minute = 0;
    second = 0;
    if (unit === "week") {
        const distance = (parts.weekday - weekStartsOn + 7) % 7;
        const shifted = addGregorianDays(year, month, day, -distance);
        year = shifted.year;
        month = shifted.month;
        day = shifted.day;
    } else if (unit === "month") {
        day = 1;
    } else if (unit === "quarter") {
        month = Math.floor((month - 1) / 3) * 3 + 1;
        day = 1;
    } else if (unit === "year") {
        month = 1;
        day = 1;
    } else if (unit === "decade") {
        year = Math.floor(year / 10) * 10;
        month = 1;
        day = 1;
    }
    return { year, month, day, hour, minute, second, millisecond: 0 };
}

/**
 * @param startEpoch - The start of the current unit.
 * @param unit - The unit to step.
 * @param timeZone - Zone the next boundary is resolved in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns The first instant of the following unit.
 */
function nextUnitStart(
    startEpoch: number,
    unit: TimeUnit | "decade",
    timeZone: string,
): number {
    if (unit === "millisecond") {
        return startEpoch + 1;
    }
    const duration = oneUnitDuration(unit);
    return addDurationToInstant(
        startEpoch,
        duration,
        timeZone,
        "compatible",
        "constrain",
    );
}

/**
 * @param unit - A boundary unit other than `"millisecond"`.
 * @returns A duration of one such unit.
 */
function oneUnitDuration(unit: TimeUnit | "decade"): Duration {
    if (unit === "decade") {
        return { years: 10 };
    }
    if (unit === "quarter") {
        return { months: 3 };
    }
    if (unit === "year") {
        return { years: 1 };
    }
    if (unit === "month") {
        return { months: 1 };
    }
    if (unit === "week") {
        return { weeks: 1 };
    }
    if (unit === "day") {
        return { days: 1 };
    }
    if (unit === "hour") {
        return { hours: 1 };
    }
    if (unit === "minute") {
        return { minutes: 1 };
    }
    return { seconds: 1 };
}

/**
 * @param epochMilliseconds - The instant to round.
 * @param unit - A clock unit.
 * @param timeZone - Zone the clock is read in.
 * @param increment - How many units form one step.
 * @param mode - Which boundary to choose.
 * @returns The rounded instant.
 */
function roundClockInstant(
    epochMilliseconds: number,
    unit: "hour" | "minute" | "second" | "millisecond",
    timeZone: string,
    increment: number,
    mode: RoundMode,
): number {
    const parts = readDateParts(epochMilliseconds, timeZone);
    const unitMilliseconds = millisecondsPerClockUnit[unit];
    const position = clockPosition(parts, unit);
    const step = unitMilliseconds * increment;
    const rounded = roundToStep(position, step, mode);
    const parent = parentUnit(unit);
    const parentStart =
        parent === undefined
            ? epochMilliseconds - parts.millisecond
            : startOfInstant(epochMilliseconds, parent, timeZone, 1);
    const parentLength = clockUnitDivisor[unit] * unitMilliseconds;
    if (rounded >= parentLength) {
        return nextUnitStart(parentStart, parent ?? "second", timeZone);
    }
    return parentStart + rounded;
}

/**
 * @param parts - Wall-clock fields.
 * @param unit - The clock unit being rounded.
 * @returns Milliseconds since the start of the next larger unit.
 */
function clockPosition(
    parts: {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    },
    unit: "hour" | "minute" | "second" | "millisecond",
): number {
    if (unit === "hour") {
        return (
            ((parts.hour * 60 + parts.minute) * 60 + parts.second) * 1_000 +
            parts.millisecond
        );
    }
    if (unit === "minute") {
        return (parts.minute * 60 + parts.second) * 1_000 + parts.millisecond;
    }
    if (unit === "second") {
        return parts.second * 1_000 + parts.millisecond;
    }
    return parts.millisecond;
}

/**
 * @param unit - A clock unit.
 * @returns The unit that contains it, or `undefined` for milliseconds.
 */
function parentUnit(
    unit: "hour" | "minute" | "second" | "millisecond",
): TimeUnit | undefined {
    if (unit === "hour") {
        return "day";
    }
    if (unit === "minute") {
        return "hour";
    }
    if (unit === "second") {
        return "minute";
    }
    return "second";
}

/**
 * @param epochMilliseconds - The instant to round.
 * @param unit - A calendar unit.
 * @param timeZone - Zone the unit starts are measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @param increment - How many units form one step.
 * @param mode - Which boundary to choose.
 * @returns The rounded instant.
 */
function roundCalendarInstant(
    epochMilliseconds: number,
    unit: TimeUnit,
    timeZone: string,
    weekStartsOn: Weekday,
    increment: number,
    mode: RoundMode,
): number {
    const currentStart = startOfInstant(
        epochMilliseconds,
        unit,
        timeZone,
        weekStartsOn,
    );
    const origin = calendarGridOrigin(
        epochMilliseconds,
        unit,
        timeZone,
        weekStartsOn,
    );
    const index = largestFittingUnits(origin, currentStart, unit, timeZone);
    const gridIndex = Math.floor(index / increment) * increment;
    const lower = addWholeUnits(origin, unit, gridIndex, timeZone);
    const upper = addWholeUnits(origin, unit, gridIndex + increment, timeZone);
    if (mode === "down") {
        return lower;
    }
    if (mode === "up") {
        return epochMilliseconds === lower ? lower : upper;
    }
    const halfway = lower + (upper - lower) / 2;
    return epochMilliseconds < halfway ? lower : upper;
}

/**
 * @param epochMilliseconds - An instant inside the grid.
 * @param unit - A calendar unit.
 * @param timeZone - Zone the origin is measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns An origin the increment grid is aligned to.
 */
function calendarGridOrigin(
    epochMilliseconds: number,
    unit: TimeUnit,
    timeZone: string,
    weekStartsOn: Weekday,
): number {
    if (unit === "week") {
        return startOfInstant(
            epochMilliseconds,
            "week",
            timeZone,
            weekStartsOn,
        );
    }
    const parts = readDateParts(epochMilliseconds, timeZone);
    if (unit === "year" || unit === "month" || unit === "quarter") {
        return instantFromWallTime(
            {
                year: parts.year,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            timeZone,
            "compatible",
        );
    }
    return startOfInstant(epochMilliseconds, "day", timeZone, weekStartsOn);
}

/**
 * @param earlierEpoch - The start instant.
 * @param laterEpoch - An instant at or after `earlierEpoch`.
 * @param unit - The unit to count.
 * @param timeZone - Zone for a calendar unit.
 * @returns The largest non-negative `n` such that adding `n` units does not pass `laterEpoch`.
 */
function largestFittingUnits(
    earlierEpoch: number,
    laterEpoch: number,
    unit: TimeUnit,
    timeZone: string,
): number {
    if (laterEpoch < earlierEpoch) {
        return 0;
    }
    let high = 1;
    while (addWholeUnits(earlierEpoch, unit, high, timeZone) <= laterEpoch) {
        if (high > 2_000_000) {
            break;
        }
        high *= 2;
    }
    let low = 0;
    while (low < high) {
        const middle = Math.floor((low + high + 1) / 2);
        if (addWholeUnits(earlierEpoch, unit, middle, timeZone) <= laterEpoch) {
            low = middle;
        } else {
            high = middle - 1;
        }
    }
    return low;
}

/**
 * @param epochMilliseconds - The start instant.
 * @param unit - The unit to add.
 * @param amount - A non-negative whole count.
 * @param timeZone - Zone for a calendar unit.
 * @returns The instant `amount` units later.
 */
function addWholeUnits(
    epochMilliseconds: number,
    unit: TimeUnit,
    amount: number,
    timeZone: string,
): number {
    if (amount === 0) {
        return epochMilliseconds;
    }
    if (!isCalendarUnit(unit)) {
        return epochMilliseconds + amount * millisecondsPerClockUnit[unit];
    }
    if (unit === "week") {
        return addDurationToInstant(
            epochMilliseconds,
            { weeks: amount },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    if (unit === "day") {
        return addDurationToInstant(
            epochMilliseconds,
            { days: amount },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    const months =
        unit === "year"
            ? amount * 12
            : unit === "quarter"
              ? amount * 3
              : amount;
    return addDurationToInstant(
        epochMilliseconds,
        { months },
        timeZone,
        "compatible",
        "constrain",
    );
}

/**
 * Picks the occurrence of a wall time that contains an instant.
 *
 * A repeated time has two instants. The later one is used when it is still
 * at or before the instant, which is the occurrence that instant sits in.
 * A skipped boundary has no exact instant, so the later candidate is the
 * first instant after the gap.
 *
 * @param parts - The aligned wall time.
 * @param timeZone - Zone the wall time is resolved in.
 * @param epochMilliseconds - The instant being aligned.
 * @returns The start instant of that occurrence.
 */
function wallInstantContaining(
    parts: Required<DatePartsInput>,
    timeZone: string,
    epochMilliseconds: number,
): number {
    const earlier = instantFromWallTime(parts, timeZone, "earlier");
    const later = instantFromWallTime(parts, timeZone, "later");
    if (later <= epochMilliseconds) {
        return later;
    }
    if (earlier <= epochMilliseconds) {
        return earlier;
    }
    return later;
}

/**
 * @param year - A full year.
 * @param month - A month from 1 through 12.
 * @returns Quarters since year 0, January.
 */
function quarterIndex(year: number, month: number): number {
    return year * 4 + Math.floor((month - 1) / 3);
}

/**
 * @param value - A position inside a span, in the same units as `step`.
 * @param step - The distance between boundaries.
 * @param mode - Which boundary to choose.
 * @returns The chosen boundary. Halfway for `"nearest"` moves to the later one.
 */
function roundToStep(value: number, step: number, mode: RoundMode): number {
    const lower = Math.floor(value / step) * step;
    const remainder = value - lower;
    if (mode === "down" || remainder === 0) {
        return lower;
    }
    if (mode === "up") {
        return lower + step;
    }
    if (remainder * 2 < step) {
        return lower;
    }
    return lower + step;
}

/**
 * @param largestUnit - The biggest unit requested.
 * @param smallestUnit - The smallest unit requested.
 * @returns Duration fields from largest to smallest, with quarter expressed as months.
 * @throws {@link RangeError} When `smallestUnit` is coarser than `largestUnit`.
 */
function durationFieldsBetween(
    largestUnit: TimeUnit,
    smallestUnit: TimeUnit,
): (keyof Duration)[] {
    const order: readonly TimeUnit[] = [
        "year",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond",
    ];
    const largestIndex = order.indexOf(
        largestUnit === "quarter" ? "month" : largestUnit,
    );
    const smallestIndex = order.indexOf(
        smallestUnit === "quarter" ? "month" : smallestUnit,
    );
    if (largestIndex < 0 || smallestIndex < 0 || smallestIndex < largestIndex) {
        throw rangeError(
            "smallestUnit",
            `a unit no larger than \`${largestUnit}\``,
            smallestUnit,
        );
    }
    return order
        .slice(largestIndex, smallestIndex + 1)
        .map((unit) => durationFieldByUnit[unit]);
}

/**
 * @param fieldName - A duration field.
 * @returns The time unit that field counts. Months stand in for quarters.
 */
function unitForDurationField(fieldName: keyof Duration): TimeUnit {
    if (fieldName === "years") {
        return "year";
    }
    if (fieldName === "months") {
        return "month";
    }
    if (fieldName === "weeks") {
        return "week";
    }
    if (fieldName === "days") {
        return "day";
    }
    if (fieldName === "hours") {
        return "hour";
    }
    if (fieldName === "minutes") {
        return "minute";
    }
    if (fieldName === "seconds") {
        return "second";
    }
    return "millisecond";
}

/**
 * @param value - A signed fractional count.
 * @param rounding - How to turn it into an integer.
 * @returns The integer. `"round"` at a half moves away from zero.
 */
function applyRounding(value: number, rounding: RoundingMode): number {
    if (rounding === "truncate") {
        return Math.trunc(value);
    }
    if (rounding === "floor") {
        return Math.floor(value);
    }
    if (rounding === "ceil") {
        return Math.ceil(value);
    }
    const sign = Math.sign(value);
    const absolute = Math.abs(value);
    const whole = Math.trunc(absolute);
    const fraction = absolute - whole;
    if (fraction > 0.5 || (fraction === 0.5 && sign !== 0)) {
        return sign * (whole + 1);
    }
    if (fraction < 0.5) {
        return sign * whole;
    }
    return sign * (whole + 1);
}
