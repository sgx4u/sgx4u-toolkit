import { addDurationToInstant, startOfInstant } from "./arithmetic.utils.js";
import { instantFromWallTime, readDateParts } from "./time-zone.utils.js";

const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];
const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

/**
 * A date phrase and the clock time that followed it, if any.
 */
interface DatedText {
    date: Date;
    end?: Date;
}

/**
 * Parses one English date phrase.
 *
 * @param text - The phrase, already trimmed.
 * @param now - The reference instant.
 * @param timeZone - The zone the phrase is read in.
 * @param preferFuture - Whether a month-day without a year prefers the future.
 * @returns The instant, or `undefined` when the phrase is not recognized.
 */
export function parseEnglishDate(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): Date | undefined {
    const parsed = parseEnglishRange(text, now, timeZone, preferFuture);
    return parsed?.date;
}

/**
 * Parses one English date or range.
 *
 * @param text - The phrase, already trimmed.
 * @param now - The reference instant.
 * @param timeZone - The zone the phrase is read in.
 * @param preferFuture - Whether a month-day without a year prefers the future.
 * @returns The start, and the end when the phrase is a range.
 */
export function parseEnglishRange(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): DatedText | undefined {
    const normalized = text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[.,]/g, "");
    if (normalized.length === 0) {
        return undefined;
    }
    const range = parseRangePhrase(normalized, now, timeZone, preferFuture);
    if (range !== undefined) {
        return range;
    }
    const { dateText, time } = splitTime(normalized);
    const day = parseDayPhrase(dateText, now, timeZone, preferFuture);
    if (day === undefined) {
        return undefined;
    }
    if (time === undefined) {
        return { date: new Date(day) };
    }
    const parts = readDateParts(day, timeZone);
    return {
        date: new Date(
            instantFromWallTime({ ...parts, ...time }, timeZone, "compatible"),
        ),
    };
}

/**
 * Finds English date phrases in a longer text.
 *
 * @param text - The text to scan.
 * @param now - The reference instant.
 * @param timeZone - The zone the phrases are read in.
 * @param preferFuture - Whether a month-day without a year prefers the future.
 * @returns Each match with its index and instant.
 */
export function findEnglishDates(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): { text: string; index: number; start: Date; end?: Date }[] {
    const pattern =
        /\b(?:from\s+\w+\s+to\s+\w+|this\s+weekend|next\s+week|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*-\s*\d{1,2}(?:st|nd|rd|th)?)?(?:\s+\d{4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{4})?|\d{4}-\d{2}-\d{2}|(?:next|this|last)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|weekend)|(?:in\s+)?(?:a|an|\d+)\s+(?:day|week|month|year)s?(?:\s+ago|\s+from\s+now)?|now|today|tomorrow|yesterday|tonight)(?:\s+at)?\s*(?:\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?|noon|midnight)?/gi;
    const found: { text: string; index: number; start: Date; end?: Date }[] =
        [];
    for (const match of text.matchAll(pattern)) {
        const phrase = match[0] ?? "";
        const index = match.index ?? 0;
        const parsed = parseEnglishRange(phrase, now, timeZone, preferFuture);
        if (parsed !== undefined) {
            found.push({
                text: phrase,
                index,
                start: parsed.date,
                ...(parsed.end !== undefined ? { end: parsed.end } : {}),
            });
        }
    }
    return found;
}

/**
 * @param text - A normalized phrase.
 * @param now - The reference instant.
 * @param timeZone - The zone.
 * @param preferFuture - Year resolution.
 * @returns A range, or `undefined` when the phrase is a single date.
 */
function parseRangePhrase(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): DatedText | undefined {
    const fromTo = /^from (.+) to (.+)$/.exec(text);
    if (fromTo?.[1] !== undefined && fromTo[2] !== undefined) {
        const start = parseDayPhrase(fromTo[1], now, timeZone, preferFuture);
        const endDay = parseDayPhrase(fromTo[2], now, timeZone, preferFuture);
        if (start === undefined || endDay === undefined) {
            return undefined;
        }
        const end = addDurationToInstant(
            endDay,
            { days: 1 },
            timeZone,
            "compatible",
            "constrain",
        );
        return { date: new Date(start), end: new Date(end) };
    }
    if (text === "this weekend" || text === "next weekend") {
        const saturday = weekdayInWeek(
            now,
            6,
            timeZone,
            text.startsWith("next") ? 1 : 0,
        );
        const end = addDurationToInstant(
            saturday,
            { days: 2 },
            timeZone,
            "compatible",
            "constrain",
        );
        return { date: new Date(saturday), end: new Date(end) };
    }
    if (text === "this week" || text === "next week") {
        const monday = weekdayInWeek(
            now,
            1,
            timeZone,
            text.startsWith("next") ? 1 : 0,
        );
        const end = addDurationToInstant(
            monday,
            { weeks: 1 },
            timeZone,
            "compatible",
            "constrain",
        );
        return { date: new Date(monday), end: new Date(end) };
    }
    const monthSpan = parseMonthSpan(text, now, timeZone, preferFuture);
    if (monthSpan !== undefined) {
        return monthSpan;
    }
    return undefined;
}

/**
 * @param text - A phrase with the time removed.
 * @param now - The reference instant.
 * @param timeZone - The zone.
 * @param preferFuture - Year resolution.
 * @returns The start of that day, or the exact instant for `now`.
 */
function parseDayPhrase(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): number | undefined {
    if (text === "" || text === "today") {
        return startOfInstant(now, "day", timeZone, 1);
    }
    if (text === "now") {
        return now;
    }
    if (text === "tomorrow") {
        return addDurationToInstant(
            startOfInstant(now, "day", timeZone, 1),
            { days: 1 },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    if (text === "yesterday") {
        return addDurationToInstant(
            startOfInstant(now, "day", timeZone, 1),
            { days: -1 },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    if (text === "tonight") {
        const parts = readDateParts(now, timeZone);
        return instantFromWallTime(
            { ...parts, hour: 18, minute: 0, second: 0, millisecond: 0 },
            timeZone,
            "compatible",
        );
    }
    const relative =
        /^(?:in )?(\d+|a|an) (day|week|month|year)s?( ago| from now)?$/.exec(
            text,
        );
    if (relative?.[1] !== undefined && relative[2] !== undefined) {
        const amount =
            relative[1] === "a" || relative[1] === "an"
                ? 1
                : Number(relative[1]);
        const sign = relative[3] === " ago" ? -1 : 1;
        const unit = `${relative[2]}s` as "days" | "weeks" | "months" | "years";
        return addDurationToInstant(
            now,
            { [unit]: sign * amount },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    const weekday =
        /^(this|next|last) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.exec(
            text,
        );
    if (weekday?.[1] !== undefined && weekday[2] !== undefined) {
        const target = weekdays.indexOf(weekday[2]) + 1;
        const weekOffset =
            weekday[1] === "next" ? 1 : weekday[1] === "last" ? -1 : 0;
        return weekdayInWeek(
            now,
            target as 1 | 2 | 3 | 4 | 5 | 6 | 7,
            timeZone,
            weekOffset,
        );
    }
    const bareWeekday = weekdays.indexOf(text);
    if (bareWeekday >= 0) {
        const target = (bareWeekday + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
        const thisWeek = weekdayInWeek(now, target, timeZone, 0);
        const today = startOfInstant(now, "day", timeZone, 1);
        if (preferFuture && thisWeek < today) {
            return addDurationToInstant(
                thisWeek,
                { days: 7 },
                timeZone,
                "compatible",
                "constrain",
            );
        }
        if (!preferFuture && thisWeek > today) {
            return addDurationToInstant(
                thisWeek,
                { days: -7 },
                timeZone,
                "compatible",
                "constrain",
            );
        }
        return thisWeek;
    }
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (
        iso?.[1] !== undefined &&
        iso[2] !== undefined &&
        iso[3] !== undefined
    ) {
        return instantFromWallTime(
            {
                year: Number(iso[1]),
                month: Number(iso[2]),
                day: Number(iso[3]),
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            timeZone,
            "compatible",
        );
    }
    return parseMonthDay(text, now, timeZone, preferFuture);
}

/**
 * @param text - A month-and-day phrase.
 * @param now - The reference instant.
 * @param timeZone - The zone.
 * @param preferFuture - Year resolution.
 * @returns The start of that day.
 */
function parseMonthDay(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): number | undefined {
    const monthFirst =
        /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/.exec(text);
    const dayFirst =
        /^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?$/.exec(text);
    let monthName: string | undefined;
    let dayText: string | undefined;
    let yearText: string | undefined;
    if (monthFirst?.[1] !== undefined && monthFirst[2] !== undefined) {
        monthName = monthFirst[1];
        dayText = monthFirst[2];
        yearText = monthFirst[3];
    } else if (dayFirst?.[1] !== undefined && dayFirst[2] !== undefined) {
        dayText = dayFirst[1];
        monthName = dayFirst[2];
        yearText = dayFirst[3];
    } else {
        return undefined;
    }
    const month = monthNumber(monthName);
    const day = Number(dayText);
    if (month === undefined || day < 1 || day > 31) {
        return undefined;
    }
    const today = readDateParts(now, timeZone);
    const year =
        yearText === undefined
            ? resolveYear(today.year, month, day, today, preferFuture)
            : Number(yearText);
    try {
        return instantFromWallTime(
            { year, month, day, hour: 0, minute: 0, second: 0, millisecond: 0 },
            timeZone,
            "compatible",
        );
    } catch {
        return undefined;
    }
}

/**
 * @param text - A phrase such as `dec 24-26`.
 * @param now - The reference instant.
 * @param timeZone - The zone.
 * @param preferFuture - Year resolution.
 * @returns The inclusive day span as a half-open interval.
 */
function parseMonthSpan(
    text: string,
    now: number,
    timeZone: string,
    preferFuture: boolean,
): DatedText | undefined {
    const match =
        /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*-\s*(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/.exec(
            text,
        );
    if (
        match?.[1] === undefined ||
        match[2] === undefined ||
        match[3] === undefined
    ) {
        return undefined;
    }
    const start = parseMonthDay(
        `${match[1]} ${match[2]}${match[4] ? ` ${match[4]}` : ""}`,
        now,
        timeZone,
        preferFuture,
    );
    const endDay = parseMonthDay(
        `${match[1]} ${match[3]}${match[4] ? ` ${match[4]}` : ""}`,
        now,
        timeZone,
        preferFuture,
    );
    if (start === undefined || endDay === undefined) {
        return undefined;
    }
    return {
        date: new Date(start),
        end: new Date(
            addDurationToInstant(
                endDay,
                { days: 1 },
                timeZone,
                "compatible",
                "constrain",
            ),
        ),
    };
}

/**
 * @param text - A normalized phrase.
 * @returns The date words and a clock time, when one was written.
 */
function splitTime(text: string): {
    dateText: string;
    time?: {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    };
} {
    const match =
        /^(.*?)(?:\s+at)?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?$/.exec(
            text,
        );
    if (
        match?.[2] !== undefined &&
        (match[4] !== undefined ||
            match[3] !== undefined ||
            match[1]?.endsWith(" at"))
    ) {
        const hour = toHour(Number(match[2]), match[4]);
        if (hour === undefined) {
            return { dateText: text };
        }
        return {
            dateText: (match[1] ?? "").trim(),
            time: {
                hour,
                minute: Number(match[3] ?? "0"),
                second: 0,
                millisecond: 0,
            },
        };
    }
    if (text.endsWith(" noon")) {
        return {
            dateText: text.slice(0, -5).trim(),
            time: { hour: 12, minute: 0, second: 0, millisecond: 0 },
        };
    }
    if (text.endsWith(" midnight")) {
        return {
            dateText: text.slice(0, -9).trim(),
            time: { hour: 0, minute: 0, second: 0, millisecond: 0 },
        };
    }
    if (text === "noon") {
        return {
            dateText: "today",
            time: { hour: 12, minute: 0, second: 0, millisecond: 0 },
        };
    }
    if (text === "midnight") {
        return {
            dateText: "today",
            time: { hour: 0, minute: 0, second: 0, millisecond: 0 },
        };
    }
    return { dateText: text };
}

/**
 * @param hour - The written hour.
 * @param meridiem - `am` or `pm`, when present.
 * @returns The hour from 0 through 23, or `undefined`.
 */
function toHour(
    hour: number,
    meridiem: string | undefined,
): number | undefined {
    if (meridiem === undefined) {
        return hour >= 0 && hour <= 23 ? hour : undefined;
    }
    if (hour < 1 || hour > 12) {
        return undefined;
    }
    const afternoon = meridiem.startsWith("p");
    if (hour === 12) {
        return afternoon ? 12 : 0;
    }
    return afternoon ? hour + 12 : hour;
}

/**
 * @param name - A month name or abbreviation.
 * @returns The month from 1, or `undefined`.
 */
function monthNumber(name: string): number | undefined {
    const index = months.findIndex(
        (month) => month.startsWith(name) && name.length >= 3,
    );
    return index < 0 ? undefined : index + 1;
}

/**
 * @param year - The reference year.
 * @param month - The month.
 * @param day - The day.
 * @param today - Today's fields.
 * @param preferFuture - Whether a past date moves to next year.
 * @returns The year to use.
 */
function resolveYear(
    year: number,
    month: number,
    day: number,
    today: { year: number; month: number; day: number },
    preferFuture: boolean,
): number {
    const past =
        month < today.month || (month === today.month && day < today.day);
    if (preferFuture && past) {
        return year + 1;
    }
    if (
        !preferFuture &&
        !past &&
        !(month === today.month && day === today.day)
    ) {
        return year - 1;
    }
    return year;
}

/**
 * @param now - The reference instant.
 * @param weekday - The ISO weekday.
 * @param timeZone - The zone.
 * @param weekOffset - `0` is this week, `1` next week, `-1` last week.
 * @returns The start of that weekday.
 */
function weekdayInWeek(
    now: number,
    weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    timeZone: string,
    weekOffset: number,
): number {
    const weekStart = startOfInstant(
        addDurationToInstant(
            now,
            { weeks: weekOffset },
            timeZone,
            "compatible",
            "constrain",
        ),
        "week",
        timeZone,
        1,
    );
    const current = readDateParts(weekStart, timeZone).weekday;
    const delta = weekday - current;
    return addDurationToInstant(
        weekStart,
        { days: delta },
        timeZone,
        "compatible",
        "constrain",
    );
}
