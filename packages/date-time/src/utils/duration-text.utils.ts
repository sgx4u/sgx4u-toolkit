import type { Duration } from "../types/duration.types.js";
import {
    durationFieldNames,
    type DurationFieldName,
} from "./duration.utils.js";

const unitAliases: Readonly<Record<string, DurationFieldName>> = {
    ms: "milliseconds",
    msec: "milliseconds",
    msecs: "milliseconds",
    millisecond: "milliseconds",
    milliseconds: "milliseconds",
    s: "seconds",
    sec: "seconds",
    secs: "seconds",
    second: "seconds",
    seconds: "seconds",
    m: "minutes",
    min: "minutes",
    mins: "minutes",
    minute: "minutes",
    minutes: "minutes",
    h: "hours",
    hr: "hours",
    hrs: "hours",
    hour: "hours",
    hours: "hours",
    d: "days",
    day: "days",
    days: "days",
    w: "weeks",
    wk: "weeks",
    wks: "weeks",
    week: "weeks",
    weeks: "weeks",
    mo: "months",
    month: "months",
    months: "months",
    y: "years",
    yr: "years",
    yrs: "years",
    year: "years",
    years: "years",
};

const compactSymbols: Readonly<Record<DurationFieldName, string>> = {
    years: "y",
    months: "mo",
    weeks: "w",
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
    milliseconds: "ms",
};

const clockExpression =
    /^(?<negative>-)?(?:(?<hours>\d+):)?(?<minutes>\d{1,2}):(?<seconds>\d{1,2}(?:\.\d+)?)$/;

const ISOExpression =
    /^(?<negative>-)?P(?:(?<years>\d+(?:\.\d+)?)Y)?(?:(?<months>\d+(?:\.\d+)?)M)?(?:(?<weeks>\d+(?:\.\d+)?)W)?(?:(?<days>\d+(?:\.\d+)?)D)?(?:T(?:(?<hours>\d+(?:\.\d+)?)H)?(?:(?<minutes>\d+(?:\.\d+)?)M)?(?:(?<seconds>\d+(?:\.\d+)?)S)?)?$/;

/**
 * Parses English duration text such as `1h 30m` or `1:30:00`.
 *
 * @param value - The candidate text.
 * @returns The duration, or `undefined` when the text does not match.
 */
export function parseDurationWords(value: string): Duration | undefined {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    const clock = clockExpression.exec(trimmed);
    if (clock?.groups !== undefined) {
        const sign = clock.groups.negative === undefined ? 1 : -1;
        const duration: Duration = {};
        if (clock.groups.hours !== undefined) {
            duration.hours = sign * Number(clock.groups.hours);
        }
        duration.minutes = sign * Number(clock.groups.minutes);
        duration.seconds = sign * Number(clock.groups.seconds);
        return duration;
    }
    let sign = 1;
    let body = trimmed;
    if (body.startsWith("-")) {
        sign = -1;
        body = body.slice(1).trim();
    }
    return durationFromWords(body, sign);
}

/**
 * Reads `1h 30m` or `1.5 hours` from left to right.
 *
 * A character that is not part of a number and a unit makes the text invalid.
 * The scan does not retry earlier splits, so a long digit string stays linear.
 *
 * @param body - The unsigned duration text.
 * @param sign - `1` or `-1`.
 * @returns The duration, or `undefined` when a token is missing.
 */
function durationFromWords(body: string, sign: number): Duration | undefined {
    const duration: Duration = {};
    let index = 0;
    let foundPiece = false;
    while (index < body.length) {
        index = skipSpaces(body, index);
        if (index >= body.length) {
            break;
        }
        const number = readDurationNumber(body, index);
        if (number === undefined) {
            return undefined;
        }
        index = skipSpaces(body, number.end);
        const unitEnd = readLetters(body, index);
        if (unitEnd === index) {
            return undefined;
        }
        const field = unitAliases[body.slice(index, unitEnd).toLowerCase()];
        if (field === undefined) {
            return undefined;
        }
        duration[field] = (duration[field] ?? 0) + sign * number.value;
        index = unitEnd;
        foundPiece = true;
    }
    if (!foundPiece) {
        return undefined;
    }
    return duration;
}

/**
 * @param text - The source text.
 * @param start - The first index to read.
 * @returns The number and the index after it.
 */
function readDurationNumber(
    text: string,
    start: number,
): { value: number; end: number } | undefined {
    let index = start;
    if (text[index] === ".") {
        index += 1;
        const fractionEnd = readDigits(text, index);
        if (fractionEnd === index) {
            return undefined;
        }
        return {
            value: Number(text.slice(start, fractionEnd)),
            end: fractionEnd,
        };
    }
    const wholeEnd = readDigits(text, index);
    if (wholeEnd === index) {
        return undefined;
    }
    index = wholeEnd;
    if (text[index] === ".") {
        const fractionEnd = readDigits(text, index + 1);
        if (fractionEnd > index + 1) {
            index = fractionEnd;
        }
    }
    return { value: Number(text.slice(start, index)), end: index };
}

/**
 * @param text - The source text.
 * @param start - The first index to read.
 * @returns The index after the digits.
 */
function readDigits(text: string, start: number): number {
    let index = start;
    while (index < text.length && isAsciiDigit(text[index] ?? "")) {
        index += 1;
    }
    return index;
}

/**
 * @param text - The source text.
 * @param start - The first index to read.
 * @returns The index after the letters.
 */
function readLetters(text: string, start: number): number {
    let index = start;
    while (index < text.length && isAsciiLetter(text[index] ?? "")) {
        index += 1;
    }
    return index;
}

/**
 * @param text - The source text.
 * @param start - The first index to skip.
 * @returns The index of the next non-space character.
 */
function skipSpaces(text: string, start: number): number {
    let index = start;
    while (index < text.length && isDurationSpace(text[index] ?? "")) {
        index += 1;
    }
    return index;
}

/**
 * @param character - One character.
 * @returns Whether it is `0` through `9`.
 */
function isAsciiDigit(character: string): boolean {
    return character >= "0" && character <= "9";
}

/**
 * @param character - One character.
 * @returns Whether it is an ASCII letter.
 */
function isAsciiLetter(character: string): boolean {
    return (
        (character >= "a" && character <= "z") ||
        (character >= "A" && character <= "Z")
    );
}

/**
 * @param character - One character.
 * @returns Whether a duration token may skip it.
 */
function isDurationSpace(character: string): boolean {
    return character.trim() === "";
}

/**
 * Parses an ISO 8601 duration.
 *
 * A fractional value is accepted only on the last component. `P` and `PT`
 * alone do not match.
 *
 * @param value - The candidate text.
 * @returns The duration, or `undefined` when the text does not match.
 */
export function parseISODurationText(value: string): Duration | undefined {
    if (value === "P" || value === "PT" || value === "-P" || value === "-PT") {
        return undefined;
    }
    const groups = ISOExpression.exec(value)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const sign = groups.negative === undefined ? 1 : -1;
    const fields: Array<[DurationFieldName, string | undefined]> = [
        ["years", groups.years],
        ["months", groups.months],
        ["weeks", groups.weeks],
        ["days", groups.days],
        ["hours", groups.hours],
        ["minutes", groups.minutes],
        ["seconds", groups.seconds],
    ];
    const present = fields.filter((entry) => entry[1] !== undefined);
    if (present.length === 0) {
        return undefined;
    }
    const fractionalIndex = present.findIndex((entry) =>
        entry[1]?.includes("."),
    );
    if (fractionalIndex !== -1 && fractionalIndex !== present.length - 1) {
        return undefined;
    }
    const duration: Duration = {};
    for (const [fieldName, text] of present) {
        if (text !== undefined) {
            duration[fieldName] = sign * Number(text);
        }
    }
    return duration;
}

/**
 * Writes a duration as an ISO 8601 duration.
 *
 * A zero duration is `PT0S`.
 *
 * @param duration - A duration.
 * @returns The ISO text.
 */
export function formatISODurationText(duration: Duration): string {
    const sign = durationFieldNames.some(
        (fieldName) => (duration[fieldName] ?? 0) < 0,
    )
        ? "-"
        : "";
    const years = absolute(duration.years);
    const months = absolute(duration.months);
    const weeks = absolute(duration.weeks);
    const days = absolute(duration.days);
    const hours = absolute(duration.hours);
    const minutes = absolute(duration.minutes);
    const seconds = absolute(duration.seconds);
    const milliseconds = absolute(duration.milliseconds);
    const date = `${numberPart(years, "Y")}${numberPart(months, "M")}${numberPart(weeks, "W")}${numberPart(days, "D")}`;
    const secondsWithMilliseconds =
        milliseconds === 0 ? seconds : seconds + milliseconds / 1_000;
    const time = `${numberPart(hours, "H")}${numberPart(minutes, "M")}${numberPart(secondsWithMilliseconds, "S")}`;
    if (date.length === 0 && time.length === 0) {
        return "PT0S";
    }
    return `${sign}P${date}${time.length === 0 ? "" : `T${time}`}`;
}

/**
 * Writes a duration as `H:mm:ss`.
 *
 * @param duration - A duration or a millisecond count.
 * @param alwaysShowHours - Whether a zero hour field is kept.
 * @param showMilliseconds - Whether to append milliseconds.
 * @returns The clock text. A negative duration has a leading `-`.
 */
export function formatClockText(
    duration: Duration | number,
    alwaysShowHours: boolean,
    showMilliseconds: boolean,
): string {
    const milliseconds =
        typeof duration === "number"
            ? duration
            : clockOnlyMilliseconds(duration);
    const sign = milliseconds < 0 ? "-" : "";
    const absoluteMilliseconds = Math.abs(milliseconds);
    const hours = Math.floor(absoluteMilliseconds / 3_600_000);
    const minutes = Math.floor((absoluteMilliseconds % 3_600_000) / 60_000);
    const seconds = Math.floor((absoluteMilliseconds % 60_000) / 1_000);
    const remainder = Math.floor(absoluteMilliseconds % 1_000);
    const hourText =
        alwaysShowHours || hours > 0
            ? `${String(hours).padStart(2, "0")}:`
            : "";
    const body = `${hourText}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    const fraction = showMilliseconds
        ? `.${String(remainder).padStart(3, "0")}`
        : "";
    return `${sign}${body}${fraction}`;
}

/**
 * Writes the largest non-zero units with compact symbols.
 *
 * @param duration - A duration or a millisecond count.
 * @param maximumUnitCount - How many units to keep.
 * @param separator - The text between units.
 * @returns Text such as `1h 30m`. Zero is `0s`.
 */
export function formatCompactText(
    duration: Duration | number,
    maximumUnitCount: number,
    separator: string,
): string {
    const source =
        typeof duration === "number"
            ? millisecondsToRoughDuration(duration)
            : duration;
    const parts: string[] = [];
    for (const fieldName of durationFieldNames) {
        const fieldValue = source[fieldName];
        if (fieldValue === undefined || fieldValue === 0) {
            continue;
        }
        parts.push(`${String(fieldValue)}${compactSymbols[fieldName]}`);
        if (parts.length === maximumUnitCount) {
            break;
        }
    }
    if (parts.length === 0) {
        return "0s";
    }
    return parts.join(separator);
}

/**
 * @param value - A field value.
 * @returns Its absolute value, or 0 when absent.
 */
function absolute(value: number | undefined): number {
    return Math.abs(value ?? 0);
}

/**
 * @param value - A field value.
 * @param suffix - The ISO designator.
 * @returns The designator, or an empty string when the value is zero.
 */
function numberPart(value: number, suffix: string): string {
    if (value === 0) {
        return "";
    }
    return `${String(value)}${suffix}`;
}

/**
 * @param duration - A duration. Calendar fields are treated as 7-day weeks and 24-hour days.
 * @returns Elapsed milliseconds, ignoring months and years.
 */
function clockOnlyMilliseconds(duration: Duration): number {
    return (
        (duration.weeks ?? 0) * 7 * 86_400_000 +
        (duration.days ?? 0) * 86_400_000 +
        (duration.hours ?? 0) * 3_600_000 +
        (duration.minutes ?? 0) * 60_000 +
        (duration.seconds ?? 0) * 1_000 +
        (duration.milliseconds ?? 0)
    );
}

/**
 * @param milliseconds - A signed length.
 * @returns A duration balanced down from days, for compact text.
 */
function millisecondsToRoughDuration(milliseconds: number): Duration {
    const sign = milliseconds < 0 ? -1 : 1;
    let remaining = Math.abs(milliseconds);
    const days = Math.floor(remaining / 86_400_000);
    remaining -= days * 86_400_000;
    const hours = Math.floor(remaining / 3_600_000);
    remaining -= hours * 3_600_000;
    const minutes = Math.floor(remaining / 60_000);
    remaining -= minutes * 60_000;
    const seconds = Math.floor(remaining / 1_000);
    remaining -= seconds * 1_000;
    const duration: Duration = {};
    if (days !== 0) {
        duration.days = sign * days;
    }
    if (hours !== 0) {
        duration.hours = sign * hours;
    }
    if (minutes !== 0) {
        duration.minutes = sign * minutes;
    }
    if (seconds !== 0) {
        duration.seconds = sign * seconds;
    }
    if (remaining !== 0) {
        duration.milliseconds = sign * remaining;
    }
    return duration;
}
