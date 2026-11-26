import type { CalendarDate } from "../types/time.types.js";
import { addGregorianDays } from "../utils/gregorian.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { GetEasterSundayParams } from "./get-easter-sunday.types.js";

/**
 * Returns Easter Sunday as a Gregorian calendar date.
 *
 * Valid for years 1583 through 9999.
 *
 * @param params - `year` is the Gregorian year; `tradition` defaults to `"western"`.
 * @returns The month and day of Easter Sunday, or `undefined` when `year` is not in range.
 * @throws {@link RangeError} When `tradition` is unknown.
 * @example
 * getEasterSunday({ year: 2026 }); // { year: 2026, month: 4, day: 5 }
 */
export function getEasterSunday({
    year,
    tradition = "western",
}: GetEasterSundayParams): CalendarDate | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    if (year < 1583 || year > 9999) {
        return undefined;
    }
    if (tradition !== "western" && tradition !== "orthodox") {
        throw rangeError("tradition", `"western" or "orthodox"`, tradition);
    }
    if (tradition === "orthodox") {
        return orthodoxEaster(year);
    }
    return westernEaster(year);
}

/**
 * Anonymous Gregorian computus.
 *
 * @param year - A year from 1583 through 9999.
 * @returns Easter Sunday.
 */
function westernEaster(year: number): CalendarDate {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return { year, month, day };
}

/**
 * Julian computus, then the Gregorian-Julian difference for that year.
 *
 * @param year - A year from 1583 through 9999.
 * @returns Easter Sunday on the Gregorian calendar.
 */
function orthodoxEaster(year: number): CalendarDate {
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    const difference = Math.floor(year / 100) - Math.floor(year / 400) - 2;
    return addGregorianDays(year, month, day, difference);
}