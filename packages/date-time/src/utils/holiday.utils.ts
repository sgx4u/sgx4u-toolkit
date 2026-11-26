import type { ConfiguredHoliday } from "../types/configured-holiday.types.js";
import type {
    Holiday,
    HolidayRule,
    ObservancePolicy,
} from "../types/holiday.types.js";
import type { CalendarDate, Weekday } from "../types/time.types.js";
import { getEasterSunday } from "../get-easter-sunday/get-easter-sunday.js";
import {
    addGregorianDays,
    ISOWeekdayNumber,
    UTCEpochMilliseconds,
} from "./gregorian.utils.js";
import { formatCalendarText } from "./iso.utils.js";

const defaultWeekend: readonly Weekday[] = [6, 7];

/**
 * Holidays produced by a list of rules in one year, sorted by observed date.
 *
 * A year missing from a `"year-table"` rule produces nothing for that rule.
 * When an observed day lands on another holiday, it moves forward to the
 * next free day. Policies other than `"none"` also skip weekend days while
 * moving.
 *
 * @param year - The Gregorian year.
 * @param rules - The holiday rules.
 * @param weekendDays - Days treated as the weekend while observing.
 * @returns The holidays.
 */
export function holidaysInYear(
    year: number,
    rules: readonly HolidayRule[],
    weekendDays: readonly Weekday[] = defaultWeekend,
): Holiday[] {
    const placed: Holiday[] = [];
    const taken = new Set<string>();
    for (const rule of rules) {
        if (!ruleIsActive(rule, year)) {
            continue;
        }
        for (const date of datesForRule(rule, year)) {
            const policy = rule.observed ?? "none";
            let observed = observeDate(date, policy, weekendDays);
            if (policy !== "none") {
                while (
                    taken.has(dateKey(observed)) ||
                    isWeekend(observed, weekendDays)
                ) {
                    observed = addGregorianDays(
                        observed.year,
                        observed.month,
                        observed.day,
                        1,
                    );
                }
            }
            taken.add(dateKey(observed));
            placed.push({
                name: rule.name,
                type: rule.type ?? "public",
                date,
                observedDate: observed,
            });
        }
    }
    placed.sort((first, second) => {
        const byDate = dateKey(first.observedDate).localeCompare(
            dateKey(second.observedDate),
        );
        return byDate === 0 ? first.name.localeCompare(second.name) : byDate;
    });
    return placed;
}

/**
 * Holiday rules expanded to `{ date, name }` for `createDateTime`.
 *
 * `date` is the observed calendar day, as `YYYY-MM-DD`.
 *
 * @param year - The Gregorian year.
 * @param rules - The holiday rules.
 * @returns The list, or `undefined` when `year` is not an integer.
 */
export function configuredHolidaysInYear(
    year: number,
    rules: readonly HolidayRule[],
): ConfiguredHoliday[] | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    return holidaysInYear(year, rules).map((holiday) => ({
        date: formatCalendarText(
            holiday.observedDate.year,
            holiday.observedDate.month,
            holiday.observedDate.day,
        ),
        name: holiday.name,
    }));
}

/**
 * Moves a holiday off a weekend according to a policy.
 *
 * @param date - The holiday's calendar date.
 * @param policy - The observance policy.
 * @param weekendDays - Days treated as the weekend.
 * @returns The substitute date. `"none"` returns `date`.
 */
export function observeDate(
    date: CalendarDate,
    policy: ObservancePolicy,
    weekendDays: readonly Weekday[] = defaultWeekend,
): CalendarDate {
    if (policy === "none" || !isWeekend(date, weekendDays)) {
        return date;
    }
    if (policy === "nearest-weekday") {
        const weekday = ISOWeekdayNumber(date.year, date.month, date.day);
        const direction = weekday === 7 ? 1 : -1;
        return addGregorianDays(date.year, date.month, date.day, direction);
    }
    if (policy === "next-monday") {
        const weekday = ISOWeekdayNumber(date.year, date.month, date.day);
        const daysUntilMonday = weekday === 7 ? 1 : 8 - weekday;
        return addGregorianDays(
            date.year,
            date.month,
            date.day,
            daysUntilMonday,
        );
    }
    let cursor = date;
    do {
        cursor = addGregorianDays(cursor.year, cursor.month, cursor.day, 1);
    } while (isWeekend(cursor, weekendDays));
    return cursor;
}

/**
 * @param rule - A holiday rule.
 * @param year - The year being expanded.
 * @returns Whether the rule applies in that year.
 */
function ruleIsActive(rule: HolidayRule, year: number): boolean {
    if (rule.activeFromYear !== undefined && year < rule.activeFromYear) {
        return false;
    }
    if (rule.activeUntilYear !== undefined && year > rule.activeUntilYear) {
        return false;
    }
    return true;
}

/**
 * @param rule - A holiday rule.
 * @param year - The Gregorian year.
 * @returns Every date the rule produces. A missing year table returns none.
 */
function datesForRule(rule: HolidayRule, year: number): CalendarDate[] {
    const ruleDate = rule.date;
    if (ruleDate.kind === "fixed") {
        return [{ year, month: ruleDate.month, day: ruleDate.day }];
    }
    if (ruleDate.kind === "nth-weekday") {
        const date = nthWeekday(
            year,
            ruleDate.month,
            ruleDate.weekday,
            ruleDate.occurrence,
        );
        return date === undefined ? [] : [date];
    }
    if (ruleDate.kind === "easter-offset") {
        const easter = getEasterSunday({
            year,
            tradition: ruleDate.tradition ?? "western",
        });
        if (easter === undefined) {
            return [];
        }
        return [
            addGregorianDays(
                easter.year,
                easter.month,
                easter.day,
                ruleDate.days,
            ),
        ];
    }
    if (ruleDate.kind === "year-table") {
        const published = ruleDate.dates[year];
        return published === undefined ? [] : [published];
    }
    return intlCalendarDates(
        year,
        ruleDate.calendar,
        ruleDate.month,
        ruleDate.day,
    );
}

/**
 * @param year - The Gregorian year.
 * @param month - The month, from 1.
 * @param weekday - The ISO weekday.
 * @param occurrence - 1 through 5, or -1 through -5.
 * @returns The date, or `undefined` when it does not exist.
 */
function nthWeekday(
    year: number,
    month: number,
    weekday: Weekday,
    occurrence: number,
): CalendarDate | undefined {
    const firstWeekday = ISOWeekdayNumber(year, month, 1);
    const firstOffset = (weekday - firstWeekday + 7) % 7;
    const index = occurrence > 0 ? occurrence - 1 : undefined;
    if (index !== undefined) {
        const day = 1 + firstOffset + index * 7;
        const probe = addGregorianDays(year, month, 1, day - 1);
        return probe.month === month ? probe : undefined;
    }
    const lastDay = addGregorianDays(year, month + 1, 1, -1);
    const lastWeekday = ISOWeekdayNumber(
        lastDay.year,
        lastDay.month,
        lastDay.day,
    );
    const back = (lastWeekday - weekday + 7) % 7;
    const fromEnd = -occurrence - 1;
    const candidate = addGregorianDays(
        lastDay.year,
        lastDay.month,
        lastDay.day,
        -(back + fromEnd * 7),
    );
    return candidate.month === month && candidate.year === year
        ? candidate
        : undefined;
}

/**
 * Gregorian dates whose Intl calendar fields match a month and day.
 *
 * @param year - The Gregorian year to scan.
 * @param calendar - An Intl calendar name.
 * @param month - The month in that calendar.
 * @param day - The day in that calendar.
 * @returns Every match. A lunar date can occur twice.
 */
function intlCalendarDates(
    year: number,
    calendar: string,
    month: number,
    day: number,
): CalendarDate[] {
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-" + calendar, {
        timeZone: "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    const matches: CalendarDate[] = [];
    let cursor = UTCEpochMilliseconds(year, 0, 1, 0, 0, 0, 0);
    const end = UTCEpochMilliseconds(year + 1, 0, 1, 0, 0, 0, 0);
    while (cursor < end) {
        const parts = formatter.formatToParts(new Date(cursor));
        const monthValue = Number(
            parts.find((part) => part.type === "month")?.value,
        );
        const dayValue = Number(
            parts.find((part) => part.type === "day")?.value,
        );
        if (monthValue === month && dayValue === day) {
            const date = new Date(cursor);
            matches.push({
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate(),
            });
        }
        cursor += 86_400_000;
    }
    return matches;
}

/**
 * @param date - A calendar date.
 * @param weekendDays - Days treated as the weekend.
 * @returns `true` when the date's weekday is listed.
 */
function isWeekend(
    date: CalendarDate,
    weekendDays: readonly Weekday[],
): boolean {
    return weekendDays.includes(
        ISOWeekdayNumber(date.year, date.month, date.day),
    );
}

/**
 * @param date - A calendar date.
 * @returns A sortable key.
 */
function dateKey(date: CalendarDate): string {
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}
