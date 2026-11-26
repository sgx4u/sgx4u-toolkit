import type { Disambiguation } from "../types/options.types.js";
import type {
    DateParts,
    DatePartsInput,
    Weekday,
} from "../types/time.types.js";
import { rangeError, typeError } from "./error.utils.js";
import {
    addGregorianDays,
    ISOWeekdayNumber,
    readUTCParts,
    UTCEpochMilliseconds,
    type GregorianParts,
} from "./gregorian.utils.js";

/**
 * One formatter per time zone, created on first use.
 *
 * Building a `DateTimeFormat` costs far more than reading one, and a call
 * resolves the same zone many times. The map stays empty until a function
 * asks for a zone.
 */
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

/** `+05:30`, `+0530`, and `+05`. Hours are two digits so `+5` does not match. */
const fixedOffsetExpression =
    /^(?<sign>[+-])(?<hours>\d{2})(?::(?<colonMinutes>\d{2})|(?<basicMinutes>\d{2}))?$/;

const millisecondsPerHour = 3_600_000;
const millisecondsPerMinute = 60_000;

/**
 * Hours around a wall time whose offsets are worth reading.
 *
 * A daylight-saving gap or overlap sits within a couple of hours. The wider
 * probes catch a zone that moves by many hours at once.
 */
const probeHourOffsets: readonly number[] = [
    0, 1, -1, 2, -2, 3, -3, 6, -6, 12, -12, 24, -24,
];

/**
 * Whether `timeZone` is an IANA name or a fixed offset the runtime accepts.
 *
 * Fixed offsets are checked from their text. Every other string is offered
 * to `Intl`, which is what decides the IANA names on this runtime.
 *
 * @param timeZone - Any value.
 * @returns `true` when later calls can use `timeZone`.
 */
export function isAcceptedTimeZone(timeZone: unknown): boolean {
    if (typeof timeZone !== "string" || timeZone.length === 0) {
        return false;
    }
    if (parseFixedOffsetMinutes(timeZone) !== undefined) {
        return true;
    }
    try {
        formatterFor(timeZone);
        return true;
    } catch {
        return false;
    }
}

/**
 * The zone a function should use.
 *
 * An omitted zone is the system zone, read on this call. A provided zone
 * must be an IANA name or a fixed offset.
 *
 * @param timeZone - The caller's option, or `undefined` for the system zone.
 * @param argumentName - The parameter name used when the zone is rejected.
 * @returns A zone string later calls can pass back in.
 * @throws {@link TypeError} When `timeZone` is present and not a string.
 * @throws {@link RangeError} When `timeZone` is not a known zone or offset.
 */
export function resolveTimeZone(
    timeZone: string | undefined,
    argumentName = "timeZone",
): string {
    if (timeZone === undefined) {
        return readSystemTimeZone();
    }
    return assertTimeZoneName(timeZone, argumentName);
}

/**
 * Wall-clock fields of an instant in a zone.
 *
 * @param epochMilliseconds - Unix time in milliseconds.
 * @param timeZone - An IANA name or a fixed offset, already checked.
 * @returns Year, month, day, time, ISO weekday, and the offset in minutes.
 */
export function readDateParts(
    epochMilliseconds: number,
    timeZone: string,
): DateParts {
    const wallClock = readWallClock(epochMilliseconds, timeZone);
    return {
        year: wallClock.year,
        month: wallClock.month,
        day: wallClock.day,
        hour: wallClock.hour,
        minute: wallClock.minute,
        second: wallClock.second,
        millisecond: wallClock.millisecond,
        weekday: ISOWeekdayNumber(
            wallClock.year,
            wallClock.month,
            wallClock.day,
        ),
        offsetMinutes:
            offsetMillisecondsAt(epochMilliseconds, timeZone) /
            millisecondsPerMinute,
    };
}

/**
 * The instant for a wall-clock time in a zone.
 *
 * A fixed offset has one instant. An IANA zone can skip a time or repeat
 * it; `disambiguation` chooses which instant, or rejects both.
 *
 * @param parts - Complete wall-clock fields. The day must exist.
 * @param timeZone - An IANA name or a fixed offset, already checked.
 * @param disambiguation - How to treat a gap or an overlap.
 * @returns Unix time in milliseconds.
 * @throws {@link RangeError} When `disambiguation` is `"reject"` and the time is skipped or repeated.
 */
export function instantFromWallTime(
    parts: Required<DatePartsInput>,
    timeZone: string,
    disambiguation: Disambiguation,
): number {
    const fixedOffsetMinutes = parseFixedOffsetMinutes(timeZone);
    const desiredEpochMilliseconds = UTCEpochMilliseconds(
        parts.year,
        (parts.month ?? 1) - 1,
        parts.day ?? 1,
        parts.hour ?? 0,
        parts.minute ?? 0,
        parts.second ?? 0,
        parts.millisecond ?? 0,
    );
    if (fixedOffsetMinutes !== undefined) {
        return (
            desiredEpochMilliseconds -
            fixedOffsetMinutes * millisecondsPerMinute
        );
    }

    const offsetAtDesired = offsetMillisecondsAt(
        desiredEpochMilliseconds,
        timeZone,
    );
    const firstInstant = desiredEpochMilliseconds - offsetAtDesired;
    if (wallClockMatches(firstInstant, parts, timeZone)) {
        const matches = [firstInstant];
        for (const hourOffset of [2, -2]) {
            const otherOffset = offsetMillisecondsAt(
                firstInstant + hourOffset * millisecondsPerHour,
                timeZone,
            );
            if (otherOffset === offsetAtDesired) {
                continue;
            }
            const otherInstant = desiredEpochMilliseconds - otherOffset;
            if (
                otherInstant !== firstInstant &&
                wallClockMatches(otherInstant, parts, timeZone)
            ) {
                matches.push(otherInstant);
            }
        }
        return chooseInstant(matches, matches, disambiguation, timeZone, parts);
    }

    const offsets = nearbyOffsets(desiredEpochMilliseconds, timeZone);
    const matches: number[] = [];
    const candidates: number[] = [];
    for (const offset of offsets) {
        const instant = desiredEpochMilliseconds - offset;
        candidates.push(instant);
        if (wallClockMatches(instant, parts, timeZone)) {
            matches.push(instant);
        }
    }
    return chooseInstant(matches, candidates, disambiguation, timeZone, parts);
}

/**
 * Fills omitted wall-clock fields with their minimums.
 *
 * @param parts - The caller's parts. `year` is required.
 * @returns Every field, with month `1`, day `1`, and time `0` where omitted.
 * @throws {@link TypeError} When `parts` is not an object or `year` is missing.
 */
export function completeDateParts(
    parts: DatePartsInput,
): Required<DatePartsInput> {
    return {
        year: parts.year,
        month: parts.month ?? 1,
        day: parts.day ?? 1,
        hour: parts.hour ?? 0,
        minute: parts.minute ?? 0,
        second: parts.second ?? 0,
        millisecond: parts.millisecond ?? 0,
    };
}

/**
 * @param timeZone - The caller's zone value.
 * @param argumentName - The parameter name used in the error.
 * @returns The same string when it is a usable zone.
 * @throws {@link TypeError} When `timeZone` is not a string.
 * @throws {@link RangeError} When `timeZone` is not a known zone or offset.
 */
export function assertTimeZoneName(
    timeZone: unknown,
    argumentName = "timeZone",
): string {
    if (typeof timeZone !== "string") {
        throw typeError(
            argumentName,
            "an IANA time zone or ±HH:mm offset",
            timeZone,
        );
    }
    if (!isAcceptedTimeZone(timeZone)) {
        throw new RangeError(
            `\`${argumentName}\` must be an IANA time zone or ±HH:mm offset; received ${JSON.stringify(timeZone)}.`,
        );
    }
    return timeZone;
}

/**
 * @param value - The caller's disambiguation option.
 * @returns `"compatible"` when `value` is omitted.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `value` is not one of the four modes.
 */
export function resolveDisambiguation(
    value: Disambiguation | undefined,
): Disambiguation {
    if (value === undefined) {
        return "compatible";
    }
    if (typeof value !== "string") {
        throw typeError(
            "disambiguation",
            `"compatible", "earlier", "later", or "reject"`,
            value,
        );
    }
    if (
        value !== "compatible" &&
        value !== "earlier" &&
        value !== "later" &&
        value !== "reject"
    ) {
        throw rangeError(
            "disambiguation",
            `"compatible", "earlier", "later", or "reject"`,
            value,
        );
    }
    return value;
}

/**
 * The system's IANA time zone, read on this call.
 *
 * @returns The zone `Intl` reports for the runtime.
 */
export function readSystemTimeZone(): string {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Offset of a fixed-offset string, in minutes.
 *
 * @param timeZone - A candidate `±HH`, `±HH:mm`, or `±HHmm` string.
 * @returns The offset, or `undefined` when the text is not that shape or is out of range.
 */
export function parseFixedOffsetMinutes(timeZone: string): number | undefined {
    const groups = fixedOffsetExpression.exec(timeZone)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const hours = Number(groups.hours);
    const minuteText = groups.colonMinutes ?? groups.basicMinutes;
    const minutes = minuteText === undefined ? 0 : Number(minuteText);
    if (hours > 23 || minutes > 59) {
        return undefined;
    }
    const magnitude = hours * 60 + minutes;
    return groups.sign === "-" ? -magnitude : magnitude;
}

/**
 * @param epochMilliseconds - Unix time in milliseconds.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns The zone's offset from UTC in milliseconds. A fraction of a minute is kept.
 */
function offsetMillisecondsAt(
    epochMilliseconds: number,
    timeZone: string,
): number {
    const fixedOffsetMinutes = parseFixedOffsetMinutes(timeZone);
    if (fixedOffsetMinutes !== undefined) {
        return fixedOffsetMinutes * millisecondsPerMinute;
    }
    const wallClock = readWallClock(epochMilliseconds, timeZone);
    const wallAsUTC = UTCEpochMilliseconds(
        wallClock.year,
        wallClock.month - 1,
        wallClock.day,
        wallClock.hour,
        wallClock.minute,
        wallClock.second,
        wallClock.millisecond,
    );
    return wallAsUTC - epochMilliseconds;
}

/**
 * @param epochMilliseconds - Unix time in milliseconds.
 * @param timeZone - An IANA name or a fixed offset.
 * @returns The wall clock in that zone.
 */
function readWallClock(
    epochMilliseconds: number,
    timeZone: string,
): GregorianParts {
    const fixedOffsetMinutes = parseFixedOffsetMinutes(timeZone);
    if (fixedOffsetMinutes !== undefined) {
        return readUTCParts(
            epochMilliseconds + fixedOffsetMinutes * millisecondsPerMinute,
        );
    }
    return readIntlWallClock(epochMilliseconds, timeZone);
}

/**
 * @param epochMilliseconds - Unix time in milliseconds.
 * @param timeZone - An IANA name `Intl` accepts.
 * @returns Wall-clock fields. A year shown with era `BC` is converted to the astronomical year.
 */
function readIntlWallClock(
    epochMilliseconds: number,
    timeZone: string,
): GregorianParts {
    const partValues = new Map<string, string>();
    for (const part of formatterFor(timeZone).formatToParts(
        epochMilliseconds,
    )) {
        if (part.type !== "literal") {
            partValues.set(part.type, part.value);
        }
    }
    let year = Number(partValues.get("year"));
    const era = partValues.get("era");
    if (era === "BC" || era === "BCE") {
        year = 1 - year;
    }
    let month = Number(partValues.get("month"));
    let day = Number(partValues.get("day"));
    let hour = Number(partValues.get("hour"));
    if (hour === 24) {
        hour = 0;
        const nextDay = addGregorianDays(year, month, day, 1);
        year = nextDay.year;
        month = nextDay.month;
        day = nextDay.day;
    }
    return {
        year,
        month,
        day,
        hour,
        minute: Number(partValues.get("minute")),
        second: Number(partValues.get("second")),
        millisecond: Number(partValues.get("fractionalSecond") ?? "0"),
    };
}

/**
 * @param instant - A candidate instant.
 * @param parts - The wall time the caller asked for.
 * @param timeZone - The zone both are read in.
 * @returns `true` when that instant shows those fields.
 */
function wallClockMatches(
    instant: number,
    parts: Required<DatePartsInput>,
    timeZone: string,
): boolean {
    const wallClock = readWallClock(instant, timeZone);
    return (
        wallClock.year === parts.year &&
        wallClock.month === parts.month &&
        wallClock.day === parts.day &&
        wallClock.hour === parts.hour &&
        wallClock.minute === parts.minute &&
        wallClock.second === parts.second &&
        wallClock.millisecond === parts.millisecond
    );
}

/**
 * @param epochMilliseconds - The UTC reading of the requested wall time.
 * @param timeZone - An IANA name.
 * @returns The distinct offsets in force near that instant.
 */
function nearbyOffsets(epochMilliseconds: number, timeZone: string): number[] {
    const offsets: number[] = [];
    const seen = new Set<number>();
    for (const hourOffset of probeHourOffsets) {
        const offset = offsetMillisecondsAt(
            epochMilliseconds + hourOffset * millisecondsPerHour,
            timeZone,
        );
        if (!seen.has(offset)) {
            seen.add(offset);
            offsets.push(offset);
        }
    }
    return offsets;
}

/**
 * @param matches - Instants whose wall clock is the requested one.
 * @param candidates - Instants computed from the nearby offsets, used for a gap.
 * @param disambiguation - How to choose when there are zero or several matches.
 * @param timeZone - The zone, named in the error.
 * @param parts - The requested wall time, named in the error.
 * @returns The chosen instant.
 * @throws {@link RangeError} When `disambiguation` is `"reject"` and the time is skipped or repeated.
 */
function chooseInstant(
    matches: readonly number[],
    candidates: readonly number[],
    disambiguation: Disambiguation,
    timeZone: string,
    parts: Required<DatePartsInput>,
): number {
    const orderedMatches = uniqueSorted(matches);
    const onlyMatch = orderedMatches[0];
    if (orderedMatches.length === 1 && onlyMatch !== undefined) {
        return onlyMatch;
    }
    if (orderedMatches.length > 1) {
        if (disambiguation === "reject") {
            throw ambiguousTimeError(timeZone, parts, "repeated");
        }
        const laterMatch = orderedMatches[orderedMatches.length - 1];
        if (disambiguation === "later" && laterMatch !== undefined) {
            return laterMatch;
        }
        if (onlyMatch !== undefined) {
            return onlyMatch;
        }
    }
    const orderedCandidates = uniqueSorted(candidates);
    const earlier = orderedCandidates[0];
    const later = orderedCandidates[orderedCandidates.length - 1];
    if (earlier === undefined || later === undefined || earlier === later) {
        throw ambiguousTimeError(timeZone, parts, "skipped");
    }
    if (disambiguation === "reject") {
        throw ambiguousTimeError(timeZone, parts, "skipped");
    }
    if (disambiguation === "earlier") {
        return earlier;
    }
    return later;
}

/**
 * @param values - Instants that may repeat.
 * @returns The same instants, each once, oldest first.
 */
function uniqueSorted(values: readonly number[]): number[] {
    const sorted = [...values].sort((first, second) => first - second);
    const unique: number[] = [];
    for (const value of sorted) {
        if (unique[unique.length - 1] !== value) {
            unique.push(value);
        }
    }
    return unique;
}

/**
 * @param timeZone - The zone that skipped or repeated the time.
 * @param parts - The wall time that could not be used as written.
 * @param status - `"skipped"` or `"repeated"`.
 * @returns The RangeError thrown for `disambiguation: "reject"`.
 */
function ambiguousTimeError(
    timeZone: string,
    parts: Required<DatePartsInput>,
    status: "skipped" | "repeated",
): RangeError {
    const wallTime = `${String(parts.year)}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
    return new RangeError(
        `\`parts\` is a ${status} time in ${JSON.stringify(timeZone)}; received ${wallTime}.`,
    );
}

/**
 * @param timeZone - An IANA name.
 * @returns The cached formatter, creating it on the first request.
 * @throws {@link RangeError} When `Intl` rejects the zone.
 */
function formatterFor(timeZone: string): Intl.DateTimeFormat {
    const cached = dateTimeFormatCache.get(timeZone);
    if (cached !== undefined) {
        return cached;
    }
    try {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            hourCycle: "h23",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            fractionalSecondDigits: 3,
            era: "short",
        });
        dateTimeFormatCache.set(timeZone, formatter);
        return formatter;
    } catch {
        throw new RangeError(
            `\`timeZone\` must be an IANA time zone or ±HH:mm offset; received ${JSON.stringify(timeZone)}.`,
        );
    }
}

/**
 * Guards a weekday number used as a week start.
 *
 * @param weekStartsOn - The caller's option.
 * @returns `1` when the option is omitted.
 * @throws {@link TypeError} When the value is not a number.
 * @throws {@link RangeError} When the value is not an ISO weekday.
 */
export function resolveWeekStartsOn(
    weekStartsOn: Weekday | undefined,
): Weekday {
    if (weekStartsOn === undefined) {
        return 1;
    }
    if (typeof weekStartsOn !== "number") {
        throw typeError(
            "weekStartsOn",
            "an ISO weekday from 1 to 7",
            weekStartsOn,
        );
    }
    if (
        !Number.isInteger(weekStartsOn) ||
        weekStartsOn < 1 ||
        weekStartsOn > 7
    ) {
        throw rangeError(
            "weekStartsOn",
            "an ISO weekday from 1 to 7",
            weekStartsOn,
        );
    }
    return weekStartsOn;
}
