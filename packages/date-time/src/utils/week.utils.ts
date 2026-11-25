import type { Weekday } from "../types/time.types.js";
import type { LocaleWeekInfo } from "../types/calendar-grid.types.js";
import {
    addGregorianDays,
    isoWeekdayNumber,
    utcEpochMilliseconds,
} from "./gregorian.utils.js";

/**
 * ISO week and week-year of a calendar date.
 *
 * Week 1 is the week that contains the first Thursday of the year. The
 * result can belong to the previous or next calendar year.
 *
 * @param year - Full year.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @returns The ISO week, from 1 through 53, and the week-year.
 */
export function isoWeekOfDate(
    year: number,
    month: number,
    day: number,
): { week: number; weekYear: number } {
    return weekOfDate(year, month, day, 1, 4);
}

/**
 * Week number for a week start and a minimum first-week length.
 *
 * @param year - Full year.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @param weekStartsOn - ISO weekday that starts the week.
 * @param minimumDaysInFirstWeek - How many days of the year the first week needs.
 * @returns The week number and the year that week belongs to.
 */
export function weekOfDate(
    year: number,
    month: number,
    day: number,
    weekStartsOn: Weekday,
    minimumDaysInFirstWeek: number,
): { week: number; weekYear: number } {
    const weekStart = startOfWeek(year, month, day, weekStartsOn);
    const thisYearStart = startOfWeekOne(
        year,
        weekStartsOn,
        minimumDaysInFirstWeek,
    );
    if (compareCalendar(weekStart, thisYearStart) < 0) {
        const previousStart = startOfWeekOne(
            year - 1,
            weekStartsOn,
            minimumDaysInFirstWeek,
        );
        return {
            week: weekNumber(previousStart, weekStart),
            weekYear: year - 1,
        };
    }
    const nextYearStart = startOfWeekOne(
        year + 1,
        weekStartsOn,
        minimumDaysInFirstWeek,
    );
    if (compareCalendar(weekStart, nextYearStart) >= 0) {
        return { week: 1, weekYear: year + 1 };
    }
    return { week: weekNumber(thisYearStart, weekStart), weekYear: year };
}

/**
 * How many ISO weeks a year contains.
 *
 * @param year - Full year.
 * @returns `53` when the year has a week 53, otherwise `52`.
 */
export function isoWeeksInYear(year: number): 52 | 53 {
    const december28 = isoWeekOfDate(year, 12, 28);
    return december28.week === 53 ? 53 : 52;
}

/**
 * Week of the month, from 1 through 6.
 *
 * @param year - Full year.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @param weekStartsOn - ISO weekday that starts the week.
 * @returns The week inside that month.
 */
export function weekOfMonth(
    year: number,
    month: number,
    day: number,
    weekStartsOn: Weekday,
): number {
    const firstWeekday = isoWeekdayNumber(year, month, 1);
    const leadingDays = (firstWeekday - weekStartsOn + 7) % 7;
    return Math.floor((day + leadingDays - 1) / 7) + 1;
}

/**
 * Day of the year, from 1 through 366.
 *
 * @param year - Full year.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @returns The day number.
 */
export function dayOfYear(year: number, month: number, day: number): number {
    const start = utcEpochMilliseconds(year, 0, 1, 0, 0, 0, 0);
    const current = utcEpochMilliseconds(year, month - 1, day, 0, 0, 0, 0);
    return Math.round((current - start) / 86_400_000) + 1;
}

/**
 * Week rules for a locale, or the ISO defaults when the runtime has none.
 *
 * @param locale - A BCP 47 tag. Omit it to use the runtime locale.
 * @returns The first day, weekend days, and minimum length of week 1.
 */
export function localeWeekInfo(locale?: string): LocaleWeekInfo {
    try {
        const tag =
            locale ?? new Intl.DateTimeFormat().resolvedOptions().locale;
        const intlLocale = new Intl.Locale(tag);
        const info = readWeekInfo(intlLocale);
        if (info !== undefined) {
            return info;
        }
    } catch {
        // The runtime locale can be missing week data. The ISO defaults apply.
    }
    return {
        firstDay: 1,
        weekendDays: [6, 7],
        minimumDaysInFirstWeek: 4,
    };
}

/**
 * @param year - Full year.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @param weekStartsOn - ISO weekday that starts the week.
 * @returns The calendar date that starts that week.
 */
function startOfWeek(
    year: number,
    month: number,
    day: number,
    weekStartsOn: Weekday,
): { year: number; month: number; day: number } {
    const weekday = isoWeekdayNumber(year, month, day);
    const distance = (weekday - weekStartsOn + 7) % 7;
    return addGregorianDays(year, month, day, -distance);
}

/**
 * @param year - The year whose first week is required.
 * @param weekStartsOn - ISO weekday that starts the week.
 * @param minimumDaysInFirstWeek - Days of `year` the first week must contain.
 * @returns The calendar date that starts week 1.
 */
function startOfWeekOne(
    year: number,
    weekStartsOn: Weekday,
    minimumDaysInFirstWeek: number,
): { year: number; month: number; day: number } {
    const januaryWeekday = isoWeekdayNumber(year, 1, 1);
    const daysBefore = (januaryWeekday - weekStartsOn + 7) % 7;
    const daysInYear = 7 - daysBefore;
    if (daysInYear >= minimumDaysInFirstWeek) {
        return addGregorianDays(year, 1, 1, -daysBefore);
    }
    return addGregorianDays(year, 1, 1, daysInYear);
}

/**
 * @param weekOne - The start of week 1.
 * @param weekStart - The start of the week being numbered.
 * @returns The week number, starting at 1.
 */
function weekNumber(
    weekOne: { year: number; month: number; day: number },
    weekStart: { year: number; month: number; day: number },
): number {
    const origin = utcEpochMilliseconds(
        weekOne.year,
        weekOne.month - 1,
        weekOne.day,
        0,
        0,
        0,
        0,
    );
    const current = utcEpochMilliseconds(
        weekStart.year,
        weekStart.month - 1,
        weekStart.day,
        0,
        0,
        0,
        0,
    );
    return Math.round((current - origin) / (7 * 86_400_000)) + 1;
}

/**
 * @param left - A calendar date.
 * @param right - A calendar date.
 * @returns Negative when `left` is earlier.
 */
function compareCalendar(
    left: { year: number; month: number; day: number },
    right: { year: number; month: number; day: number },
): number {
    if (left.year !== right.year) {
        return left.year - right.year;
    }
    if (left.month !== right.month) {
        return left.month - right.month;
    }
    return left.day - right.day;
}

/**
 * Week fields as `Intl.Locale` exposes them, under either name.
 */
interface RuntimeWeekInfo {
    firstDay?: number;
    weekend?: readonly number[];
    minimalDays?: number;
    minimumDays?: number;
}

/**
 * @param intlLocale - A locale that may know its week rules.
 * @returns Normalized week rules, or `undefined` when the runtime has none.
 */
function readWeekInfo(intlLocale: Intl.Locale): LocaleWeekInfo | undefined {
    const localeWithWeek = intlLocale as Intl.Locale & {
        getWeekInfo?: () => RuntimeWeekInfo;
        weekInfo?: RuntimeWeekInfo;
    };
    const info =
        typeof localeWithWeek.getWeekInfo === "function"
            ? localeWithWeek.getWeekInfo()
            : localeWithWeek.weekInfo;
    if (info?.firstDay === undefined || !Array.isArray(info.weekend)) {
        return undefined;
    }
    const firstDay = normalizeWeekday(info.firstDay);
    const weekendDays = info.weekend.map((day) => normalizeWeekday(day));
    const minimum = info.minimalDays ?? info.minimumDays ?? 4;
    if (
        firstDay === undefined ||
        weekendDays.some((day) => day === undefined)
    ) {
        return undefined;
    }
    return {
        firstDay,
        weekendDays: weekendDays.filter(
            (day): day is Weekday => day !== undefined,
        ),
        minimumDaysInFirstWeek: minimum,
    };
}

/**
 * @param day - A weekday number that might already be ISO.
 * @returns The ISO weekday, or `undefined` when the number is outside 1 through 7.
 */
function normalizeWeekday(day: number): Weekday | undefined {
    if (day === 0) {
        return 7;
    }
    if (day >= 1 && day <= 7) {
        return day as Weekday;
    }
    return undefined;
}
