import type {
    RecurrenceFrequency,
    RecurrenceRule,
    RecurrenceWeekday,
} from "../types/recurrence.types.js";
import type { Weekday } from "../types/time.types.js";
import { addDurationToInstant } from "./arithmetic.utils.js";
import {
    addGregorianDays,
    daysInGregorianMonth,
    ISOWeekdayNumber,
} from "./gregorian.utils.js";
import { weekOfDate } from "./week.utils.js";
import {
    instantFromWallTime,
    readDateParts,
    resolveTimeZone,
} from "./time-zone.utils.js";
import { rangeError, typeError } from "./error.utils.js";

const frequencies = [
    "yearly",
    "monthly",
    "weekly",
    "daily",
    "hourly",
    "minutely",
    "secondly",
] as const;
const weekdayTokens = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;
const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

/**
 * Parses an RFC 5545 rule with DTSTART, RRULE, RDATE, and EXDATE.
 *
 * `RSCALE` and `SKIP` are not supported. Text that uses either returns
 * `undefined`. A floating start is stored without a time zone.
 *
 * @param value - The rule text.
 * @returns The rule, or `undefined` when the text is not a supported rule.
 * @throws {@link TypeError} When `value` is not a string.
 */
export function parseRecurrenceText(value: string): RecurrenceRule | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    if (/\b(RSCALE|SKIP)\b/i.test(value)) {
        return undefined;
    }
    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    let start: Date | undefined;
    let timeZone: string | undefined;
    let frequency: RecurrenceFrequency | undefined;
    const rule: Partial<RecurrenceRule> = {};
    const additional: Date[] = [];
    const excluded: Date[] = [];
    for (const line of lines) {
        if (/^DTSTART/i.test(line)) {
            const parsed = parseStart(line);
            if (parsed === undefined) {
                return undefined;
            }
            start = parsed.start;
            timeZone = parsed.timeZone;
            continue;
        }
        if (/^RRULE:/i.test(line)) {
            const parts = line.slice(line.indexOf(":") + 1).split(";");
            for (const part of parts) {
                const [name, raw] = part.split("=");
                if (
                    name === undefined ||
                    raw === undefined ||
                    !applyPart(rule, name, raw)
                ) {
                    return undefined;
                }
            }
            frequency = rule.frequency;
            continue;
        }
        if (/^RDATE/i.test(line)) {
            const dates = parseDateList(line, timeZone);
            if (dates === undefined) {
                return undefined;
            }
            additional.push(...dates);
            continue;
        }
        if (/^EXDATE/i.test(line)) {
            const dates = parseDateList(line, timeZone);
            if (dates === undefined) {
                return undefined;
            }
            excluded.push(...dates);
            continue;
        }
        return undefined;
    }
    if (start === undefined || frequency === undefined) {
        return undefined;
    }
    if (rule.count !== undefined && rule.until !== undefined) {
        return undefined;
    }
    return {
        start,
        ...(timeZone !== undefined ? { timeZone } : {}),
        frequency,
        ...(rule.interval !== undefined ? { interval: rule.interval } : {}),
        ...(rule.count !== undefined ? { count: rule.count } : {}),
        ...(rule.until !== undefined ? { until: rule.until } : {}),
        ...(rule.weekStart !== undefined ? { weekStart: rule.weekStart } : {}),
        ...(rule.byMonth !== undefined ? { byMonth: rule.byMonth } : {}),
        ...(rule.byWeekNumber !== undefined
            ? { byWeekNumber: rule.byWeekNumber }
            : {}),
        ...(rule.byYearDay !== undefined ? { byYearDay: rule.byYearDay } : {}),
        ...(rule.byMonthDay !== undefined
            ? { byMonthDay: rule.byMonthDay }
            : {}),
        ...(rule.byWeekday !== undefined ? { byWeekday: rule.byWeekday } : {}),
        ...(rule.byHour !== undefined ? { byHour: rule.byHour } : {}),
        ...(rule.byMinute !== undefined ? { byMinute: rule.byMinute } : {}),
        ...(rule.bySecond !== undefined ? { bySecond: rule.bySecond } : {}),
        ...(rule.bySetPosition !== undefined
            ? { bySetPosition: rule.bySetPosition }
            : {}),
        ...(additional.length > 0 ? { additionalDates: additional } : {}),
        ...(excluded.length > 0 ? { excludedDates: excluded } : {}),
    };
}

/**
 * Writes a rule as RFC 5545 text.
 *
 * @param rule - The rule to write.
 * @returns `DTSTART` and `RRULE` lines, plus `RDATE` and `EXDATE` when present.
 */
export function formatRecurrenceText(rule: RecurrenceRule): string {
    const zone = rule.timeZone;
    const lines = [formatStart(rule.start, zone)];
    const parts = [`FREQ=${rule.frequency.toUpperCase()}`];
    if ((rule.interval ?? 1) !== 1) {
        parts.push(`INTERVAL=${rule.interval}`);
    }
    if (rule.count !== undefined) {
        parts.push(`COUNT=${rule.count}`);
    }
    if (rule.until !== undefined) {
        parts.push(`UNTIL=${formatStamp(rule.until, "UTC")}`);
    }
    if (rule.weekStart !== undefined && rule.weekStart !== 1) {
        parts.push(`WKST=${weekdayTokens[rule.weekStart - 1]}`);
    }
    pushList(parts, "BYMONTH", rule.byMonth);
    pushList(parts, "BYWEEKNO", rule.byWeekNumber);
    pushList(parts, "BYYEARDAY", rule.byYearDay);
    pushList(parts, "BYMONTHDAY", rule.byMonthDay);
    if (rule.byWeekday !== undefined) {
        parts.push(`BYDAY=${rule.byWeekday.map(formatWeekday).join(",")}`);
    }
    pushList(parts, "BYHOUR", rule.byHour);
    pushList(parts, "BYMINUTE", rule.byMinute);
    pushList(parts, "BYSECOND", rule.bySecond);
    pushList(parts, "BYSETPOS", rule.bySetPosition);
    lines.push(`RRULE:${parts.join(";")}`);
    if (rule.additionalDates !== undefined && rule.additionalDates.length > 0) {
        lines.push(
            `RDATE:${rule.additionalDates.map((date) => formatStamp(date, zone ?? "UTC")).join(",")}`,
        );
    }
    if (rule.excludedDates !== undefined && rule.excludedDates.length > 0) {
        lines.push(
            `EXDATE:${rule.excludedDates.map((date) => formatStamp(date, zone ?? "UTC")).join(",")}`,
        );
    }
    return lines.join("\n");
}

/**
 * Occurrences inside a half-open interval.
 *
 * @param rule - The rule.
 * @param start - The inclusive start.
 * @param end - The exclusive end.
 * @param limit - The most occurrences that may be returned.
 * @returns The occurrences, oldest first.
 * @throws {@link RangeError} When more than `limit` occurrences fall in the interval.
 */
export function occurrencesBetween(
    rule: RecurrenceRule,
    start: number,
    end: number,
    limit: number,
): Date[] {
    const generated = generateOccurrences(rule, end, (rule.count ?? limit) + 1);
    const inside = generated.filter(
        (date) => date.getTime() >= start && date.getTime() < end,
    );
    if (inside.length > limit) {
        throw rangeError("limit", `at most ${limit} occurrences`, limit);
    }
    return inside;
}

/**
 * The next or previous occurrence.
 *
 * @param rule - The rule.
 * @param now - The reference instant.
 * @param direction - `1` looks forward and `-1` looks backward.
 * @param includeNow - Whether an occurrence at `now` counts.
 * @returns The occurrence, or `undefined` when the rule has none in that direction.
 */
export function adjacentOccurrence(
    rule: RecurrenceRule,
    now: number,
    direction: 1 | -1,
    includeNow: boolean,
): Date | undefined {
    const horizon = addDurationToInstant(
        now,
        { years: direction * 20 },
        rule.timeZone ?? "UTC",
        "compatible",
        "constrain",
    );
    const start = direction > 0 ? now : horizon;
    const end = direction > 0 ? horizon : now + (includeNow ? 1 : 0);
    // The first later occurrence is enough. Periods after it sort later.
    const stopAtInstant =
        direction > 0 ? now + (includeNow ? 0 : 1) : undefined;
    const found = generateOccurrences(
        rule,
        Math.max(start, end),
        rule.count ?? 10_000,
        stopAtInstant,
    ).filter((date) => {
        const time = date.getTime();
        if (direction > 0) {
            return includeNow
                ? time >= now && time < end
                : time > now && time < end;
        }
        return includeNow
            ? time <= now && time >= start
            : time < now && time >= start;
    });
    return direction > 0 ? found[0] : found[found.length - 1];
}

/**
 * English text for a rule.
 *
 * @param rule - The rule.
 * @returns A sentence such as `Every 2 weeks on Monday and Friday`.
 */
export function describeRecurrence(rule: RecurrenceRule): string {
    const interval = rule.interval ?? 1;
    const unit = frequencyUnit(rule.frequency, interval);
    const days = rule.byWeekday
        ?.map((weekday) => weekdayNames[weekday.weekday - 1])
        .join(" and ");
    return days === undefined || days.length === 0
        ? `Every ${unit}`
        : `Every ${unit} on ${days}`;
}

/**
 * @param rule - The rule.
 * @param untilEpoch - Stop once candidates pass this instant.
 * @param maximum - The most occurrences to generate.
 * @param stopAtInstant - Stop once an occurrence at or after this instant
 * is recorded. Additional dates are still included.
 * @returns Occurrences from the start through `until`, oldest first.
 */
function generateOccurrences(
    rule: RecurrenceRule,
    untilEpoch: number,
    maximum: number,
    stopAtInstant?: number,
): Date[] {
    const timeZone = rule.timeZone ?? "UTC";
    const interval = rule.interval ?? 1;
    const occurrences: number[] = [];
    const excluded = new Set(
        (rule.excludedDates ?? []).map((date) => date.getTime()),
    );
    let recordedStopInstant = false;
    for (
        let index = 0;
        index < 20_000 && occurrences.length < maximum && !recordedStopInstant;
        index += 1
    ) {
        const period = movePeriod(
            rule.start.getTime(),
            rule.frequency,
            interval * index,
            timeZone,
        );
        if (
            rule.until !== undefined &&
            period > rule.until.getTime() &&
            index > 0
        ) {
            break;
        }
        if (period > untilEpoch && index > 0) {
            break;
        }
        let candidates = expandPeriod(period, rule, timeZone).filter(
            (instant) => {
                if (instant < rule.start.getTime() || excluded.has(instant)) {
                    return false;
                }
                if (
                    rule.until !== undefined &&
                    instant > rule.until.getTime()
                ) {
                    return false;
                }
                return true;
            },
        );
        if (rule.bySetPosition !== undefined && rule.bySetPosition.length > 0) {
            candidates = applySetPosition(candidates, rule.bySetPosition);
        }
        for (const candidate of candidates) {
            occurrences.push(candidate);
            if (stopAtInstant !== undefined && candidate >= stopAtInstant) {
                recordedStopInstant = true;
                break;
            }
            if (rule.count !== undefined && occurrences.length >= rule.count) {
                break;
            }
        }
        if (rule.count !== undefined && occurrences.length >= rule.count) {
            break;
        }
    }
    for (const extra of rule.additionalDates ?? []) {
        if (!excluded.has(extra.getTime())) {
            occurrences.push(extra.getTime());
        }
    }
    return [...new Set(occurrences)]
        .sort((first, second) => first - second)
        .slice(0, rule.count ?? occurrences.length)
        .map((instant) => new Date(instant));
}

/**
 * @param periodStart - An instant inside the period.
 * @param rule - The rule.
 * @param timeZone - The zone.
 * @returns Candidate instants in that period, oldest first.
 */
function expandPeriod(
    periodStart: number,
    rule: RecurrenceRule,
    timeZone: string,
): number[] {
    const parts = readDateParts(periodStart, timeZone);
    const hours = rule.byHour ?? [parts.hour];
    const minutes = rule.byMinute ?? [parts.minute];
    const seconds = rule.bySecond ?? [parts.second];
    const days = daysInPeriod(parts, rule);
    const instants: number[] = [];
    for (const day of days) {
        if (rule.byMonth !== undefined && !rule.byMonth.includes(day.month)) {
            continue;
        }
        if (
            rule.byYearDay !== undefined &&
            !rule.byYearDay.includes(dayOfYear(day.year, day.month, day.day))
        ) {
            continue;
        }
        for (const hour of hours) {
            for (const minute of minutes) {
                for (const second of seconds) {
                    if (day.day > daysInGregorianMonth(day.year, day.month)) {
                        continue;
                    }
                    try {
                        const instant = instantFromWallTime(
                            {
                                year: day.year,
                                month: day.month,
                                day: day.day,
                                hour,
                                minute,
                                second,
                                millisecond: 0,
                            },
                            timeZone,
                            "compatible",
                        );
                        const resolved = readDateParts(instant, timeZone);
                        if (
                            resolved.day === day.day &&
                            resolved.hour === hour
                        ) {
                            instants.push(instant);
                        }
                    } catch {
                        continue;
                    }
                }
            }
        }
    }
    return [...new Set(instants)].sort((first, second) => first - second);
}

/**
 * @param parts - The period's wall-clock date.
 * @param rule - The rule.
 * @returns The calendar days the period can fire on.
 */
function daysInPeriod(
    parts: { year: number; month: number; day: number; weekday: Weekday },
    rule: RecurrenceRule,
): { year: number; month: number; day: number }[] {
    if (rule.frequency === "yearly" && rule.byWeekNumber !== undefined) {
        return daysInWeekNumbers(parts, rule);
    }
    if (rule.frequency === "yearly") {
        const months = rule.byMonth ?? [parts.month];
        const days: { year: number; month: number; day: number }[] = [];
        for (const month of months) {
            days.push(...daysInMonth(parts.year, month, parts.day, rule));
        }
        return days;
    }
    if (rule.frequency === "monthly") {
        return daysInMonth(parts.year, parts.month, parts.day, rule);
    }
    if (rule.frequency === "weekly") {
        return daysInWeek(parts, rule);
    }
    return [{ year: parts.year, month: parts.month, day: parts.day }];
}

/**
 * Days of the requested week numbers in a year.
 *
 * Week 1 is the first week, starting on `weekStart`, that has at least four
 * days in the year. A negative week counts back from the last week. When
 * `BYDAY` is absent, the weekday of the start is used.
 *
 * @param parts - A day in the year being expanded.
 * @param rule - The rule.
 * @returns One date for each selected weekday of each selected week.
 */
function daysInWeekNumbers(
    parts: { year: number; month: number; day: number; weekday: Weekday },
    rule: RecurrenceRule,
): { year: number; month: number; day: number }[] {
    const weekStartsOn = rule.weekStart ?? 1;
    const lastWeek = weekOfDate(parts.year, 12, 28, weekStartsOn, 4).week;
    const weekNumbers = (rule.byWeekNumber ?? [])
        .map((weekNumber) =>
            weekNumber > 0 ? weekNumber : lastWeek + weekNumber + 1,
        )
        .filter((weekNumber) => weekNumber >= 1 && weekNumber <= lastWeek);
    const weekdays = rule.byWeekday?.map((weekday) => weekday.weekday) ?? [
        parts.weekday,
    ];
    const weekOne = startOfWeekContaining(parts.year, 1, 4, weekStartsOn);
    const days: { year: number; month: number; day: number }[] = [];
    for (const weekNumber of weekNumbers) {
        const weekStart = addGregorianDays(
            weekOne.year,
            weekOne.month,
            weekOne.day,
            (weekNumber - 1) * 7,
        );
        for (let offset = 0; offset < 7; offset += 1) {
            const date = addGregorianDays(
                weekStart.year,
                weekStart.month,
                weekStart.day,
                offset,
            );
            const weekday = ISOWeekdayNumber(date.year, date.month, date.day);
            if (weekdays.includes(weekday)) {
                days.push(date);
            }
        }
    }
    return days;
}

/**
 * @param year - The year.
 * @param month - The month.
 * @param day - A day that belongs to the wanted week.
 * @param weekStartsOn - ISO weekday that starts the week.
 * @returns The first day of that week.
 */
function startOfWeekContaining(
    year: number,
    month: number,
    day: number,
    weekStartsOn: Weekday,
): { year: number; month: number; day: number } {
    const weekday = ISOWeekdayNumber(year, month, day);
    const daysBack = (weekday - weekStartsOn + 7) % 7;
    return addGregorianDays(year, month, day, -daysBack);
}

/**
 * @param year - The year.
 * @param month - The month.
 * @param fallbackDay - The day used when the rule does not name one.
 * @param rule - The rule.
 * @returns The days in that month.
 */
function daysInMonth(
    year: number,
    month: number,
    fallbackDay: number,
    rule: RecurrenceRule,
): { year: number; month: number; day: number }[] {
    const length = daysInGregorianMonth(year, month);
    const days = new Set<number>();
    if (rule.byMonthDay !== undefined) {
        for (const day of rule.byMonthDay) {
            const resolved = day > 0 ? day : length + day + 1;
            if (resolved >= 1 && resolved <= length) {
                days.add(resolved);
            }
        }
    }
    if (rule.byWeekday !== undefined) {
        for (const weekday of rule.byWeekday) {
            for (const day of weekdayDaysInMonth(year, month, weekday)) {
                days.add(day);
            }
        }
    }
    if (days.size === 0) {
        if (fallbackDay <= length) {
            days.add(fallbackDay);
        }
    }
    return [...days]
        .sort((first, second) => first - second)
        .map((day) => ({ year, month, day }));
}

/**
 * @param parts - A day in the week.
 * @param rule - The rule.
 * @returns The selected weekdays of that week.
 */
function daysInWeek(
    parts: { year: number; month: number; day: number; weekday: Weekday },
    rule: RecurrenceRule,
): { year: number; month: number; day: number }[] {
    const weekdays = rule.byWeekday ?? [{ weekday: parts.weekday }];
    const mondayOffset = parts.weekday - 1;
    const epoch = Date.UTC(parts.year, parts.month - 1, parts.day);
    return weekdays.map((weekday) => {
        const date = new Date(
            epoch + (weekday.weekday - 1 - mondayOffset) * 86_400_000,
        );
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate(),
        };
    });
}

/**
 * @param year - The year.
 * @param month - The month.
 * @param weekday - The weekday and optional occurrence.
 * @returns The matching days.
 */
function weekdayDaysInMonth(
    year: number,
    month: number,
    weekday: RecurrenceWeekday,
): number[] {
    const length = daysInGregorianMonth(year, month);
    const matches: number[] = [];
    for (let day = 1; day <= length; day += 1) {
        if (ISOWeekdayNumber(year, month, day) === weekday.weekday) {
            matches.push(day);
        }
    }
    if (weekday.occurrence === undefined) {
        return matches;
    }
    if (weekday.occurrence > 0) {
        const day = matches[weekday.occurrence - 1];
        return day === undefined ? [] : [day];
    }
    const day = matches[matches.length + weekday.occurrence];
    return day === undefined ? [] : [day];
}

/**
 * @param candidates - Sorted instants in one period.
 * @param positions - 1-based positions. Negative positions count from the end.
 * @returns The selected instants.
 */
function applySetPosition(
    candidates: readonly number[],
    positions: readonly number[],
): number[] {
    const selected = new Set<number>();
    for (const position of positions) {
        const index =
            position > 0 ? position - 1 : candidates.length + position;
        const value = candidates[index];
        if (value !== undefined) {
            selected.add(value);
        }
    }
    return [...selected].sort((first, second) => first - second);
}

/**
 * @param epochMilliseconds - The start.
 * @param frequency - The frequency.
 * @param steps - How many intervals to move. Zero stays put.
 * @param timeZone - The zone.
 * @returns The moved instant.
 */
function movePeriod(
    epochMilliseconds: number,
    frequency: RecurrenceFrequency,
    steps: number,
    timeZone: string,
): number {
    if (steps === 0) {
        return epochMilliseconds;
    }
    const duration =
        frequency === "yearly"
            ? { years: steps }
            : frequency === "monthly"
              ? { months: steps }
              : frequency === "weekly"
                ? { weeks: steps }
                : frequency === "daily"
                  ? { days: steps }
                  : frequency === "hourly"
                    ? { hours: steps }
                    : frequency === "minutely"
                      ? { minutes: steps }
                      : { seconds: steps };
    return addDurationToInstant(
        epochMilliseconds,
        duration,
        timeZone,
        "compatible",
        "constrain",
    );
}

/**
 * @param year - The year.
 * @param month - The month.
 * @param day - The day.
 * @returns The day of the year, from 1.
 */
function dayOfYear(year: number, month: number, day: number): number {
    let count = day;
    for (let cursor = 1; cursor < month; cursor += 1) {
        count += daysInGregorianMonth(year, cursor);
    }
    return count;
}

/**
 * @param line - A `DTSTART` line.
 * @returns The instant and optional zone.
 */
function parseStart(
    line: string,
): { start: Date; timeZone?: string } | undefined {
    const match = /^DTSTART(?:;TZID=([^:]+))?:(\d{8}(?:T\d{6}Z?)?)$/i.exec(
        line.trim(),
    );
    if (match?.[2] === undefined) {
        return undefined;
    }
    const zone = match[1];
    const stamp = parseStamp(match[2], zone ?? "UTC");
    if (stamp === undefined) {
        return undefined;
    }
    return zone === undefined
        ? { start: stamp }
        : { start: stamp, timeZone: resolveTimeZone(zone) };
}

/**
 * @param line - An `RDATE` or `EXDATE` line.
 * @param timeZone - The rule zone used when a stamp has none.
 * @returns The instants.
 */
function parseDateList(
    line: string,
    timeZone: string | undefined,
): Date[] | undefined {
    const text = line.slice(line.indexOf(":") + 1);
    const dates: Date[] = [];
    for (const stamp of text.split(",")) {
        const parsed = parseStamp(stamp.trim(), timeZone ?? "UTC");
        if (parsed === undefined) {
            return undefined;
        }
        dates.push(parsed);
    }
    return dates;
}

/**
 * @param stamp - `YYYYMMDD` or `YYYYMMDDTHHMMSS` with an optional `Z`.
 * @param timeZone - The zone for a floating stamp.
 * @returns The instant.
 */
function parseStamp(stamp: string, timeZone: string): Date | undefined {
    const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(
        stamp,
    );
    if (
        match?.[1] === undefined ||
        match[2] === undefined ||
        match[3] === undefined
    ) {
        return undefined;
    }
    const zone = match[7] === "Z" ? "UTC" : timeZone;
    try {
        return new Date(
            instantFromWallTime(
                {
                    year: Number(match[1]),
                    month: Number(match[2]),
                    day: Number(match[3]),
                    hour: Number(match[4] ?? "0"),
                    minute: Number(match[5] ?? "0"),
                    second: Number(match[6] ?? "0"),
                    millisecond: 0,
                },
                zone,
                "compatible",
            ),
        );
    } catch {
        return undefined;
    }
}

/**
 * @param rule - The rule being filled.
 * @param name - The RRULE part name.
 * @param raw - The part value.
 * @returns `false` when the part is not valid.
 */
function applyPart(
    rule: Partial<RecurrenceRule>,
    name: string,
    raw: string,
): boolean {
    const key = name.toUpperCase();
    if (key === "FREQ") {
        const frequency = raw.toLowerCase();
        if (!(frequencies as readonly string[]).includes(frequency)) {
            return false;
        }
        rule.frequency = frequency as RecurrenceFrequency;
        return true;
    }
    if (key === "INTERVAL") {
        const interval = Number(raw);
        if (!Number.isInteger(interval) || interval < 1) {
            return false;
        }
        rule.interval = interval;
        return true;
    }
    if (key === "COUNT") {
        const count = Number(raw);
        if (!Number.isInteger(count) || count < 1) {
            return false;
        }
        rule.count = count;
        return true;
    }
    if (key === "UNTIL") {
        const until = parseStamp(raw, "UTC");
        if (until === undefined) {
            return false;
        }
        rule.until = until;
        return true;
    }
    if (key === "WKST") {
        const weekday = weekdayToken(raw);
        if (weekday === undefined) {
            return false;
        }
        rule.weekStart = weekday;
        return true;
    }
    if (key === "BYDAY") {
        const weekdays = raw.split(",").map(parseWeekdayToken);
        if (weekdays.some((weekday) => weekday === undefined)) {
            return false;
        }
        rule.byWeekday = weekdays as RecurrenceWeekday[];
        return true;
    }
    const numbers = raw.split(",").map(Number);
    if (numbers.some((value) => !Number.isInteger(value))) {
        return false;
    }
    if (key === "BYMONTH") {
        rule.byMonth = numbers;
    } else if (key === "BYWEEKNO") {
        rule.byWeekNumber = numbers;
    } else if (key === "BYYEARDAY") {
        rule.byYearDay = numbers;
    } else if (key === "BYMONTHDAY") {
        rule.byMonthDay = numbers;
    } else if (key === "BYHOUR") {
        rule.byHour = numbers;
    } else if (key === "BYMINUTE") {
        rule.byMinute = numbers;
    } else if (key === "BYSECOND") {
        rule.bySecond = numbers;
    } else if (key === "BYSETPOS") {
        rule.bySetPosition = numbers;
    } else {
        return false;
    }
    return true;
}

/**
 * @param token - `MO` or `2MO` or `-1FR`.
 * @returns The weekday, or `undefined`.
 */
function parseWeekdayToken(token: string): RecurrenceWeekday | undefined {
    const match = /^([+-]?\d+)?(MO|TU|WE|TH|FR|SA|SU)$/i.exec(token);
    if (match?.[2] === undefined) {
        return undefined;
    }
    const weekday = weekdayToken(match[2]);
    if (weekday === undefined) {
        return undefined;
    }
    return match[1] === undefined
        ? { weekday }
        : { weekday, occurrence: Number(match[1]) };
}

/**
 * @param token - A two-letter weekday.
 * @returns The ISO weekday, or `undefined`.
 */
function weekdayToken(token: string): Weekday | undefined {
    const index = weekdayTokens.indexOf(
        token.toUpperCase() as (typeof weekdayTokens)[number],
    );
    return index < 0 ? undefined : ((index + 1) as Weekday);
}

/**
 * @param weekday - A recurrence weekday.
 * @returns `MO` or `2MO`.
 */
function formatWeekday(weekday: RecurrenceWeekday): string {
    const token = weekdayTokens[weekday.weekday - 1] ?? "MO";
    return weekday.occurrence === undefined
        ? token
        : `${weekday.occurrence}${token}`;
}

/**
 * @param parts - The RRULE parts being built.
 * @param name - The part name.
 * @param values - The values, when the rule has them.
 */
function pushList(
    parts: string[],
    name: string,
    values: readonly number[] | undefined,
): void {
    if (values !== undefined && values.length > 0) {
        parts.push(`${name}=${values.join(",")}`);
    }
}

/**
 * @param date - The instant.
 * @param timeZone - The zone, or UTC for a `Z` stamp.
 * @returns A basic stamp.
 */
function formatStamp(date: Date, timeZone: string): string {
    const parts = readDateParts(date.getTime(), timeZone);
    const stamp = `${pad(parts.year, 4)}${pad(parts.month, 2)}${pad(parts.day, 2)}T${pad(parts.hour, 2)}${pad(parts.minute, 2)}${pad(parts.second, 2)}`;
    return timeZone === "UTC" ? `${stamp}Z` : stamp;
}

/**
 * @param date - The start.
 * @param timeZone - The optional zone.
 * @returns A `DTSTART` line.
 */
function formatStart(date: Date, timeZone: string | undefined): string {
    if (timeZone === undefined) {
        return `DTSTART:${formatStamp(date, "UTC")}`;
    }
    return `DTSTART;TZID=${timeZone}:${formatStamp(date, timeZone)}`;
}

/**
 * @param value - A number.
 * @param width - How many digits to write.
 * @returns The padded text.
 */
function pad(value: number, width: number): string {
    return String(value).padStart(width, "0");
}

/**
 * @param frequency - The frequency.
 * @param interval - The interval.
 * @returns `week` or `2 weeks`.
 */
function frequencyUnit(
    frequency: RecurrenceFrequency,
    interval: number,
): string {
    const name = frequency === "daily" ? "day" : frequency.slice(0, -2);
    return interval === 1 ? name : `${interval} ${name}s`;
}
