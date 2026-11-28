import type { CronSchedule } from "../types/cron.types.js";
import { addDurationToInstant, startOfInstant } from "./arithmetic.utils.js";
import { daysInGregorianMonth } from "./gregorian.utils.js";
import { rangeError, typeError } from "./error.utils.js";
import { instantFromWallTime, readDateParts } from "./time-zone.utils.js";

const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
];
const weekdayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekdayLabels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const nicknames: Readonly<Record<string, string>> = {
    "@yearly": "0 0 0 1 1 *",
    "@annually": "0 0 0 1 1 *",
    "@monthly": "0 0 0 1 * *",
    "@weekly": "0 0 0 * * 0",
    "@daily": "0 0 0 * * *",
    "@midnight": "0 0 0 * * *",
    "@hourly": "0 0 * * * *",
};

/**
 * A parsed day field, including cron's last-day and nth-weekday marks.
 */
interface ParsedDayField {
    values: readonly number[] | "any";
    last: boolean;
    lastOffset?: number;
    nearestWeekday?: number;
    lastWeekday: boolean;
    nth: { dayOfWeek: number; occurrence: number }[];
    lastOfWeekday: number[];
}

/**
 * Parses a cron expression.
 *
 * @param expression - The expression, including `@daily` nicknames.
 * @param seconds - Whether a seconds field is optional, required, or forbidden.
 * @returns The schedule, or `undefined` when the text is not a cron expression.
 * @throws {@link TypeError} When `expression` is not a string.
 * @throws {@link RangeError} When `seconds` is not a known mode.
 */
export function parseCronText(
    expression: string,
    seconds: "optional" | "required" | "none" = "optional",
): CronSchedule | undefined {
    if (typeof expression !== "string") {
        throw typeError("expression", "a string", expression);
    }
    if (
        seconds !== "optional" &&
        seconds !== "required" &&
        seconds !== "none"
    ) {
        throw rangeError(
            "seconds",
            `"optional", "required", or "none"`,
            seconds,
        );
    }
    const trimmed = expression.trim().replace(/\s+/g, " ");
    if (trimmed.toLowerCase() === "@reboot") {
        return undefined;
    }
    const expanded = nicknames[trimmed.toLowerCase()] ?? trimmed;
    const fields = expanded.split(" ");
    let secondText: string | undefined = "0";
    let minuteText: string | undefined;
    let hourText: string | undefined;
    let dayOfMonthText: string | undefined;
    let monthText: string | undefined;
    let dayOfWeekText: string | undefined;
    if (fields.length === 5) {
        if (seconds === "required") {
            return undefined;
        }
        [minuteText, hourText, dayOfMonthText, monthText, dayOfWeekText] =
            fields;
    } else if (fields.length === 6) {
        if (seconds === "none") {
            return undefined;
        }
        [
            secondText,
            minuteText,
            hourText,
            dayOfMonthText,
            monthText,
            dayOfWeekText,
        ] = fields;
    } else {
        return undefined;
    }
    if (
        secondText === undefined ||
        minuteText === undefined ||
        hourText === undefined ||
        dayOfMonthText === undefined ||
        monthText === undefined ||
        dayOfWeekText === undefined
    ) {
        return undefined;
    }
    const secondValues = parseNumberField(secondText, 0, 59, false);
    const minutes = parseNumberField(minuteText, 0, 59, false);
    const hours = parseNumberField(hourText, 0, 23, false);
    const months = parseNumberField(monthText, 1, 12, false, monthNames);
    const dayOfMonth = parseDayField(dayOfMonthText, "month");
    const dayOfWeek = parseDayField(dayOfWeekText, "week");
    if (
        secondValues === undefined ||
        minutes === undefined ||
        hours === undefined ||
        months === undefined ||
        dayOfMonth === undefined ||
        dayOfWeek === undefined
    ) {
        return undefined;
    }
    return {
        expression: trimmed,
        seconds: secondValues === "any" ? range(0, 59) : secondValues,
        minutes: minutes === "any" ? range(0, 59) : minutes,
        hours: hours === "any" ? range(0, 23) : hours,
        daysOfMonth: dayOfMonth.values,
        months: months === "any" ? range(1, 12) : months,
        daysOfWeek: normalizeWeekdays(dayOfWeek.values),
        lastDayOfMonth: dayOfMonth.last,
        ...(dayOfMonth.lastOffset !== undefined
            ? { lastDayOfMonthOffset: dayOfMonth.lastOffset }
            : {}),
        ...(dayOfMonth.nearestWeekday !== undefined
            ? { nearestWeekdayToDay: dayOfMonth.nearestWeekday }
            : {}),
        lastWeekdayOfMonth: dayOfMonth.lastWeekday,
        ...(dayOfWeek.nth.length > 0
            ? { nthWeekdayOfMonth: dayOfWeek.nth }
            : {}),
        ...(dayOfWeek.lastOfWeekday.length > 0
            ? { lastWeekdayOfWeekInMonth: dayOfWeek.lastOfWeekday }
            : {}),
    };
}

/**
 * Whether a schedule fires at an instant.
 *
 * When both the day of the month and the day of the week are restricted,
 * either field matching is enough.
 *
 * @param schedule - A parsed schedule.
 * @param epochMilliseconds - The instant.
 * @param timeZone - The zone the fields are read in.
 * @returns `true` when the schedule fires then.
 */
export function cronMatches(
    schedule: CronSchedule,
    epochMilliseconds: number,
    timeZone: string,
): boolean {
    const parts = readDateParts(epochMilliseconds, timeZone);
    if (!schedule.months.includes(parts.month)) {
        return false;
    }
    if (!schedule.hours.includes(parts.hour)) {
        return false;
    }
    if (!schedule.minutes.includes(parts.minute)) {
        return false;
    }
    if (!schedule.seconds.includes(parts.second)) {
        return false;
    }
    const dayOfMonthRestricted = isDayOfMonthRestricted(schedule);
    const dayOfWeekRestricted = isDayOfWeekRestricted(schedule);
    const dayOfMonthMatches = dayOfMonthMatchesSchedule(schedule, parts);
    const dayOfWeekMatches = dayOfWeekMatchesSchedule(schedule, parts);
    if (dayOfMonthRestricted && dayOfWeekRestricted) {
        return dayOfMonthMatches || dayOfWeekMatches;
    }
    if (dayOfMonthRestricted) {
        return dayOfMonthMatches;
    }
    if (dayOfWeekRestricted) {
        return dayOfWeekMatches;
    }
    return true;
}

/**
 * The next instants at which a schedule fires.
 *
 * A skipped wall time does not run. A repeated wall time runs once, at the
 * earlier instant.
 *
 * @param schedule - A parsed schedule.
 * @param start - The first instant that may be returned is strictly after this.
 * @param count - How many runs to return.
 * @param end - An exclusive bound. The search also stops after 366 days.
 * @param timeZone - The zone the schedule is evaluated in.
 * @returns The runs, oldest first.
 */
export function upcomingCronRuns(
    schedule: CronSchedule,
    start: number,
    count: number,
    end: number | undefined,
    timeZone: string,
): Date[] {
    const runs: Date[] = [];
    if (
        cronMatches(schedule, start, timeZone) &&
        !isLaterRepeatedInstant(start, timeZone) &&
        (end === undefined || start < end)
    ) {
        runs.push(new Date(start));
    }
    let cursor = start;
    const limit = start + 366 * 86_400_000;
    let steps = 0;
    while (runs.length < count && steps < 400_000) {
        const next = nextCandidate(cursor, schedule, timeZone);
        if (
            next === undefined ||
            next > limit ||
            (end !== undefined && next >= end)
        ) {
            break;
        }
        if (
            !isLaterRepeatedInstant(next, timeZone) &&
            cronMatches(schedule, next, timeZone)
        ) {
            runs.push(new Date(next));
        }
        cursor = next;
        steps += 1;
    }
    return runs;
}

/**
 * Earlier instants at which a schedule fired.
 *
 * @param schedule - A parsed schedule.
 * @param before - The exclusive end. A run at this instant is not returned.
 * @param count - How many runs to return.
 * @param timeZone - The zone the schedule is evaluated in.
 * @returns The runs, newest first.
 */
export function earlierCronRuns(
    schedule: CronSchedule,
    before: number,
    count: number,
    timeZone: string,
): Date[] {
    const runs: Date[] = [];
    let dayStart = startOfInstant(before - 1, "day", timeZone, 1);
    for (let day = 0; day < 400 && runs.length < count; day += 1) {
        const matches = instantsOnDay(dayStart, schedule, timeZone)
            .filter((instant) => instant < before)
            .reverse();
        for (const instant of matches) {
            runs.push(new Date(instant));
            if (runs.length === count) {
                break;
            }
        }
        dayStart = addDurationToInstant(
            dayStart,
            { days: -1 },
            timeZone,
            "compatible",
            "constrain",
        );
    }
    return runs;
}

/**
 * @param dayStart - The start of a calendar day.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns Matching instants on that day, oldest first.
 */
function instantsOnDay(
    dayStart: number,
    schedule: CronSchedule,
    timeZone: string,
): number[] {
    const parts = readDateParts(dayStart, timeZone);
    if (
        !schedule.months.includes(parts.month) ||
        !dayMatches(schedule, parts)
    ) {
        return [];
    }
    const instants: number[] = [];
    const seconds =
        schedule.seconds.length === 1 && schedule.seconds[0] === 0
            ? [0]
            : schedule.seconds;
    for (const hour of schedule.hours) {
        for (const minute of schedule.minutes) {
            for (const second of seconds) {
                try {
                    const instant = instantFromWallTime(
                        { ...parts, hour, minute, second, millisecond: 0 },
                        timeZone,
                        "earlier",
                    );
                    const resolved = readDateParts(instant, timeZone);
                    if (
                        resolved.hour === hour &&
                        resolved.minute === minute &&
                        resolved.second === second &&
                        resolved.day === parts.day &&
                        cronMatches(schedule, instant, timeZone) &&
                        !isLaterRepeatedInstant(instant, timeZone)
                    ) {
                        instants.push(instant);
                    }
                } catch {
                    continue;
                }
            }
        }
    }
    return instants;
}

/**
 * English text for a schedule.
 *
 * @param schedule - A parsed schedule.
 * @param hourCycle - `"h12"` writes AM/PM. `"h23"` writes 00–23.
 * @returns A sentence such as `At 09:00 AM, Monday through Friday`.
 */
export function describeCronSchedule(
    schedule: CronSchedule,
    hourCycle: "h12" | "h23",
): string {
    const minute =
        schedule.minutes.length === 1 ? schedule.minutes[0] : undefined;
    const hour = schedule.hours.length === 1 ? schedule.hours[0] : undefined;
    let clock = "every minute";
    if (hour !== undefined && minute !== undefined) {
        clock = formatClock(hour, minute, hourCycle);
    } else if (minute !== undefined && schedule.hours.length === 24) {
        clock = `minute ${String(minute).padStart(2, "0")} of every hour`;
    }
    const days = describeDays(schedule);
    return days === "" ? `At ${clock}` : `At ${clock}, ${days}`;
}

/**
 * @param text - One cron field.
 * @param minimum - The smallest legal value.
 * @param maximum - The largest legal value.
 * @param allowQuestion - Whether `?` is allowed.
 * @param names - Optional three-letter names, index 0 meaning value 1 for months and 0 for weekdays.
 * @returns The values, `"any"`, or `undefined` when the field is invalid.
 */
function parseNumberField(
    text: string,
    minimum: number,
    maximum: number,
    allowQuestion: boolean,
    names?: readonly string[],
): readonly number[] | "any" | undefined {
    if (text === "*" || (allowQuestion && text === "?")) {
        return "any";
    }
    const pieces = text.split(",");
    const values = new Set<number>();
    for (const piece of pieces) {
        const parsed = parsePiece(piece, minimum, maximum, names);
        if (parsed === undefined) {
            return undefined;
        }
        for (const value of parsed) {
            values.add(value);
        }
    }
    if (values.size === 0) {
        return undefined;
    }
    return [...values].sort((first, second) => first - second);
}

/**
 * @param text - A day-of-month or day-of-week field.
 * @param kind - Which special tokens are legal.
 * @returns The parsed field, or `undefined`.
 */
function parseDayField(
    text: string,
    kind: "month" | "week",
): ParsedDayField | undefined {
    if (text === "*" || text === "?") {
        return {
            values: "any",
            last: false,
            lastWeekday: false,
            nth: [],
            lastOfWeekday: [],
        };
    }
    const pieces = text.split(",");
    const values = new Set<number>();
    let last = false;
    let lastOffset: number | undefined;
    let nearestWeekday: number | undefined;
    let lastWeekday = false;
    const nth: { dayOfWeek: number; occurrence: number }[] = [];
    const lastOfWeekday: number[] = [];
    let sawNumber = false;
    for (const piece of pieces) {
        const lower = piece.toLowerCase();
        if (kind === "month" && lower === "l") {
            last = true;
            continue;
        }
        if (kind === "month" && lower === "lw") {
            lastWeekday = true;
            continue;
        }
        const offset = kind === "month" ? /^l-(\d+)$/i.exec(piece) : null;
        if (offset?.[1] !== undefined) {
            last = true;
            lastOffset = Number(offset[1]);
            continue;
        }
        const nearest = kind === "month" ? /^(\d+)w$/i.exec(piece) : null;
        if (nearest?.[1] !== undefined) {
            const day = Number(nearest[1]);
            if (day < 1 || day > 31) {
                return undefined;
            }
            nearestWeekday = day;
            continue;
        }
        const nthMatch =
            kind === "week"
                ? /^([0-7]|sun|mon|tue|wed|thu|fri|sat)#([1-5])$/i.exec(piece)
                : null;
        if (nthMatch?.[1] !== undefined && nthMatch[2] !== undefined) {
            const dayOfWeek = namedWeekday(nthMatch[1]);
            if (dayOfWeek === undefined) {
                return undefined;
            }
            nth.push({
                dayOfWeek: dayOfWeek === 7 ? 0 : dayOfWeek,
                occurrence: Number(nthMatch[2]),
            });
            continue;
        }
        const lastWeekdayMatch =
            kind === "week"
                ? /^([0-7]|sun|mon|tue|wed|thu|fri|sat)l$/i.exec(piece)
                : null;
        if (lastWeekdayMatch?.[1] !== undefined) {
            const dayOfWeek = namedWeekday(lastWeekdayMatch[1]);
            if (dayOfWeek === undefined) {
                return undefined;
            }
            lastOfWeekday.push(dayOfWeek === 7 ? 0 : dayOfWeek);
            continue;
        }
        const numbers = parseNumberField(
            piece,
            kind === "month" ? 1 : 0,
            kind === "month" ? 31 : 7,
            false,
            kind === "week" ? weekdayNames : undefined,
        );
        if (numbers === undefined || numbers === "any") {
            return undefined;
        }
        sawNumber = true;
        for (const value of numbers) {
            values.add(kind === "week" && value === 7 ? 0 : value);
        }
    }
    if (
        !sawNumber &&
        !last &&
        !lastWeekday &&
        nearestWeekday === undefined &&
        nth.length === 0 &&
        lastOfWeekday.length === 0
    ) {
        return undefined;
    }
    return {
        values: sawNumber
            ? [...values].sort((first, second) => first - second)
            : "any",
        last,
        ...(lastOffset !== undefined ? { lastOffset } : {}),
        ...(nearestWeekday !== undefined ? { nearestWeekday } : {}),
        lastWeekday,
        nth,
        lastOfWeekday,
    };
}

/**
 * @param piece - One list item, possibly a range or a step.
 * @param minimum - The smallest legal value.
 * @param maximum - The largest legal value.
 * @param names - Optional names.
 * @returns The expanded values, or `undefined`.
 */
function parsePiece(
    piece: string,
    minimum: number,
    maximum: number,
    names?: readonly string[],
): number[] | undefined {
    const [span, stepText] = piece.split("/");
    if (
        span === undefined ||
        span.length === 0 ||
        piece.split("/").length > 2
    ) {
        return undefined;
    }
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) {
        return undefined;
    }
    let start = minimum;
    let end = maximum;
    if (span !== "*") {
        const bounds = span.split("-");
        if (bounds.length > 2) {
            return undefined;
        }
        const parsedStart = namedNumber(
            bounds[0] ?? "",
            minimum,
            maximum,
            names,
        );
        const parsedEnd =
            bounds.length === 2
                ? namedNumber(bounds[1] ?? "", minimum, maximum, names)
                : parsedStart;
        if (
            parsedStart === undefined ||
            parsedEnd === undefined ||
            parsedEnd < parsedStart
        ) {
            return undefined;
        }
        start = parsedStart;
        end = parsedEnd;
    }
    const values: number[] = [];
    for (let value = start; value <= end; value += step) {
        values.push(value);
    }
    return values;
}

/**
 * @param text - A number or a name.
 * @param minimum - The smallest legal value.
 * @param maximum - The largest legal value.
 * @param names - Optional names. Index 0 is `minimum` when minimum is 0, otherwise index 0 is 1.
 * @returns The number, or `undefined`.
 */
function namedNumber(
    text: string,
    minimum: number,
    maximum: number,
    names?: readonly string[],
): number | undefined {
    const nameIndex = names?.indexOf(text.toLowerCase()) ?? -1;
    const value =
        nameIndex >= 0 ? nameIndex + (minimum === 0 ? 0 : 1) : Number(text);
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
        return undefined;
    }
    return value;
}

/**
 * @param text - A weekday number or name.
 * @returns The cron weekday, with Sunday kept as 0 or 7, or `undefined`.
 */
function namedWeekday(text: string): number | undefined {
    return namedNumber(text, 0, 7, weekdayNames);
}

/**
 * @param values - Weekday values, or `"any"`.
 * @returns The same field with Sunday `7` normalized to `0`.
 */
function normalizeWeekdays(
    values: readonly number[] | "any",
): readonly number[] | "any" {
    if (values === "any") {
        return "any";
    }
    return [...new Set(values.map((value) => (value === 7 ? 0 : value)))].sort(
        (first, second) => first - second,
    );
}

/**
 * @param minimum - The first value.
 * @param maximum - The last value.
 * @returns Every integer in the closed range.
 */
function range(minimum: number, maximum: number): number[] {
    const values: number[] = [];
    for (let value = minimum; value <= maximum; value += 1) {
        values.push(value);
    }
    return values;
}

/**
 * @param schedule - A parsed schedule.
 * @returns `true` when the day of the month is not "every day".
 */
function isDayOfMonthRestricted(schedule: CronSchedule): boolean {
    return (
        schedule.daysOfMonth !== "any" ||
        schedule.lastDayOfMonth ||
        schedule.nearestWeekdayToDay !== undefined ||
        schedule.lastWeekdayOfMonth
    );
}

/**
 * @param schedule - A parsed schedule.
 * @returns `true` when the day of the week is not "every day".
 */
function isDayOfWeekRestricted(schedule: CronSchedule): boolean {
    return (
        schedule.daysOfWeek !== "any" ||
        (schedule.nthWeekdayOfMonth?.length ?? 0) > 0 ||
        (schedule.lastWeekdayOfWeekInMonth?.length ?? 0) > 0
    );
}

/**
 * @param schedule - A parsed schedule.
 * @param parts - The wall-clock fields.
 * @returns `true` when the day of the month matches.
 */
function dayOfMonthMatchesSchedule(
    schedule: CronSchedule,
    parts: { year: number; month: number; day: number; weekday: number },
): boolean {
    if (
        schedule.daysOfMonth !== "any" &&
        schedule.daysOfMonth.includes(parts.day)
    ) {
        return true;
    }
    const length = daysInGregorianMonth(parts.year, parts.month);
    if (schedule.lastDayOfMonth) {
        const offset = schedule.lastDayOfMonthOffset ?? 0;
        if (parts.day === length - offset) {
            return true;
        }
    }
    if (
        schedule.lastWeekdayOfMonth &&
        parts.day === lastWeekday(parts.year, parts.month)
    ) {
        return true;
    }
    if (schedule.nearestWeekdayToDay !== undefined) {
        return (
            parts.day ===
            nearestWeekday(
                parts.year,
                parts.month,
                schedule.nearestWeekdayToDay,
            )
        );
    }
    return false;
}

/**
 * @param schedule - A parsed schedule.
 * @param parts - The wall-clock fields.
 * @returns `true` when the day of the week matches.
 */
function dayOfWeekMatchesSchedule(
    schedule: CronSchedule,
    parts: { year: number; month: number; day: number; weekday: number },
): boolean {
    const cronWeekday = parts.weekday === 7 ? 0 : parts.weekday;
    if (
        schedule.daysOfWeek !== "any" &&
        schedule.daysOfWeek.includes(cronWeekday)
    ) {
        return true;
    }
    const occurrence = Math.floor((parts.day - 1) / 7) + 1;
    if (
        schedule.nthWeekdayOfMonth?.some(
            (item) =>
                item.dayOfWeek === cronWeekday &&
                item.occurrence === occurrence,
        )
    ) {
        return true;
    }
    if (schedule.lastWeekdayOfWeekInMonth?.includes(cronWeekday)) {
        const length = daysInGregorianMonth(parts.year, parts.month);
        return parts.day + 7 > length;
    }
    return false;
}

/**
 * @param year - The Gregorian year.
 * @param month - The month.
 * @returns The last Monday-to-Friday day of the month.
 */
function lastWeekday(year: number, month: number): number {
    let day = daysInGregorianMonth(year, month);
    while (day > 0) {
        const weekday = weekdayOf(year, month, day);
        if (weekday >= 1 && weekday <= 5) {
            return day;
        }
        day -= 1;
    }
    return 1;
}

/**
 * @param year - The Gregorian year.
 * @param month - The month.
 * @param day - The day `n` in `nW`.
 * @returns The nearest weekday, staying inside the month.
 */
function nearestWeekday(year: number, month: number, day: number): number {
    const length = daysInGregorianMonth(year, month);
    const bounded = Math.min(day, length);
    const weekday = weekdayOf(year, month, bounded);
    if (weekday === 6) {
        return bounded === 1 ? 3 : bounded - 1;
    }
    if (weekday === 7) {
        return bounded === length ? bounded - 2 : bounded + 1;
    }
    return bounded;
}

/**
 * @param year - The Gregorian year.
 * @param month - The month.
 * @param day - The day.
 * @returns The ISO weekday.
 */
function weekdayOf(year: number, month: number, day: number): number {
    const instant = Date.UTC(year, month - 1, day);
    const date = new Date(instant);
    if (year >= 0 && year < 100) {
        date.setUTCFullYear(year, month - 1, day);
    }
    const utc = date.getUTCDay();
    return utc === 0 ? 7 : utc;
}

/**
 * @param after - The exclusive start.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns The next candidate instant, or `undefined` when the search is exhausted.
 */
function nextCandidate(
    after: number,
    schedule: CronSchedule,
    timeZone: string,
): number | undefined {
    let cursor = alignForward(after, schedule, timeZone);
    for (let step = 0; step < 2_000; step += 1) {
        const parts = readDateParts(cursor, timeZone);
        if (!schedule.months.includes(parts.month)) {
            cursor = firstOfNextListedMonth(
                parts.year,
                parts.month,
                schedule,
                timeZone,
            );
            continue;
        }
        if (!dayMatches(schedule, parts)) {
            cursor = nextDayStart(cursor, timeZone);
            continue;
        }
        if (!schedule.hours.includes(parts.hour)) {
            cursor = nextListedHour(cursor, parts.hour, schedule, timeZone);
            continue;
        }
        if (!schedule.minutes.includes(parts.minute)) {
            cursor = nextListedMinute(cursor, parts.minute, schedule, timeZone);
            continue;
        }
        if (!schedule.seconds.includes(parts.second)) {
            cursor += 1_000;
            continue;
        }
        if (isLaterRepeatedInstant(cursor, timeZone)) {
            cursor += schedule.seconds.length > 1 ? 1_000 : 60_000;
            continue;
        }
        return cursor;
    }
    return undefined;
}

/**
 * @param schedule - A parsed schedule.
 * @param parts - Wall-clock fields.
 * @returns `true` when this calendar day can fire.
 */
function dayMatches(
    schedule: CronSchedule,
    parts: { year: number; month: number; day: number; weekday: number },
): boolean {
    const dayOfMonthRestricted = isDayOfMonthRestricted(schedule);
    const dayOfWeekRestricted = isDayOfWeekRestricted(schedule);
    if (dayOfMonthRestricted && dayOfWeekRestricted) {
        return (
            dayOfMonthMatchesSchedule(schedule, parts) ||
            dayOfWeekMatchesSchedule(schedule, parts)
        );
    }
    if (dayOfMonthRestricted) {
        return dayOfMonthMatchesSchedule(schedule, parts);
    }
    if (dayOfWeekRestricted) {
        return dayOfWeekMatchesSchedule(schedule, parts);
    }
    return true;
}

/**
 * @param after - The exclusive start.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns The first second or minute boundary strictly after `after`.
 */
function alignForward(
    after: number,
    schedule: CronSchedule,
    timeZone: string,
): number {
    const usesSeconds =
        schedule.seconds.length !== 1 || schedule.seconds[0] !== 0;
    if (usesSeconds) {
        return after + 1;
    }
    const parts = readDateParts(after, timeZone);
    const minuteStart = instantFromWallTime(
        { ...parts, second: 0, millisecond: 0 },
        timeZone,
        "earlier",
    );
    if (minuteStart > after && !isLaterRepeatedInstant(minuteStart, timeZone)) {
        return minuteStart;
    }
    return addDurationToInstant(
        minuteStart,
        { minutes: 1 },
        timeZone,
        "earlier",
        "constrain",
    );
}

/**
 * @param year - The current year.
 * @param month - The current month.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns The start of the next listed month.
 */
function firstOfNextListedMonth(
    year: number,
    month: number,
    schedule: CronSchedule,
    timeZone: string,
): number {
    for (let offset = 1; offset <= 12; offset += 1) {
        const nextMonth = ((month - 1 + offset) % 12) + 1;
        const nextYear = year + Math.floor((month - 1 + offset) / 12);
        if (schedule.months.includes(nextMonth)) {
            return instantFromWallTime(
                {
                    year: nextYear,
                    month: nextMonth,
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
    }
    return instantFromWallTime(
        {
            year: year + 1,
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

/**
 * @param epochMilliseconds - An instant on the current day.
 * @param timeZone - The zone.
 * @returns The start of the next calendar day.
 */
function nextDayStart(epochMilliseconds: number, timeZone: string): number {
    const start = startOfInstant(epochMilliseconds, "day", timeZone, 1);
    return addDurationToInstant(
        start,
        { days: 1 },
        timeZone,
        "compatible",
        "constrain",
    );
}

/**
 * @param epochMilliseconds - The current instant.
 * @param hour - The current hour.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns The next listed hour, or the next day when none remain.
 */
function nextListedHour(
    epochMilliseconds: number,
    hour: number,
    schedule: CronSchedule,
    timeZone: string,
): number {
    const nextHour = schedule.hours.find((value) => value > hour);
    const parts = readDateParts(epochMilliseconds, timeZone);
    if (nextHour === undefined) {
        return nextDayStart(epochMilliseconds, timeZone);
    }
    return instantFromWallTime(
        { ...parts, hour: nextHour, minute: 0, second: 0, millisecond: 0 },
        timeZone,
        "compatible",
    );
}

/**
 * @param epochMilliseconds - The current instant.
 * @param minute - The current minute.
 * @param schedule - A parsed schedule.
 * @param timeZone - The zone.
 * @returns The next listed minute, or the next hour when none remain.
 */
function nextListedMinute(
    epochMilliseconds: number,
    minute: number,
    schedule: CronSchedule,
    timeZone: string,
): number {
    const nextMinute = schedule.minutes.find((value) => value > minute);
    const parts = readDateParts(epochMilliseconds, timeZone);
    if (nextMinute === undefined) {
        return nextListedHour(
            epochMilliseconds,
            parts.hour,
            {
                ...schedule,
                hours: schedule.hours.filter((value) => value > parts.hour),
            },
            timeZone,
        );
    }
    return instantFromWallTime(
        { ...parts, minute: nextMinute, second: 0, millisecond: 0 },
        timeZone,
        "compatible",
    );
}

/**
 * @param epochMilliseconds - An instant.
 * @param timeZone - The zone.
 * @returns `true` when this wall time also occurred earlier the same morning.
 */
function isLaterRepeatedInstant(
    epochMilliseconds: number,
    timeZone: string,
): boolean {
    const parts = readDateParts(epochMilliseconds, timeZone);
    try {
        const earlier = instantFromWallTime(parts, timeZone, "earlier");
        return Math.abs(earlier - epochMilliseconds) > 1_000;
    } catch {
        return false;
    }
}

/**
 * @param hour - The hour from 0 through 23.
 * @param minute - The minute.
 * @param hourCycle - Which clock to write.
 * @returns Clock text.
 */
function formatClock(
    hour: number,
    minute: number,
    hourCycle: "h12" | "h23",
): string {
    const paddedMinute = String(minute).padStart(2, "0");
    if (hourCycle === "h23") {
        return `${String(hour).padStart(2, "0")}:${paddedMinute}`;
    }
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(hour12).padStart(2, "0")}:${paddedMinute} ${period}`;
}

/**
 * @param schedule - A parsed schedule.
 * @returns The day clause, or an empty string when the schedule is every day.
 */
function describeDays(schedule: CronSchedule): string {
    if (
        schedule.daysOfWeek !== "any" &&
        schedule.daysOfWeek.length > 0 &&
        schedule.daysOfMonth === "any"
    ) {
        const labels = schedule.daysOfWeek.map(
            (day) => weekdayLabels[day] ?? String(day),
        );
        if (isContiguous(schedule.daysOfWeek) && labels.length > 1) {
            return `${labels[0]} through ${labels[labels.length - 1]}`;
        }
        return labels.join(" and ");
    }
    return "";
}

/**
 * @param values - Sorted numbers.
 * @returns `true` when each value is one more than the previous.
 */
function isContiguous(values: readonly number[]): boolean {
    for (let index = 1; index < values.length; index += 1) {
        if (values[index] !== (values[index - 1] ?? 0) + 1) {
            return false;
        }
    }
    return true;
}
