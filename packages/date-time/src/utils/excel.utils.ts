import type { CalendarDate, TimeOfDay } from "../types/time.types.js";
import { addGregorianDays, UTCEpochMilliseconds } from "./gregorian.utils.js";

const millisecondsPerDay = 86_400_000;

/**
 * The calendar date and time of day named by a spreadsheet serial.
 */
export interface ExcelDateParts extends CalendarDate, TimeOfDay {}

/**
 * Converts a calendar date and time of day to a spreadsheet serial.
 *
 * The 1900 system never returns 60. 1900-03-01 is 61. The 1904 system
 * uses 0 for 1904-01-01.
 *
 * @param parts - The local calendar date and time.
 * @param dateSystem - `1900` or `1904`.
 * @returns The serial, including the time of day as a fraction.
 */
export function serialFromParts(
    parts: ExcelDateParts,
    dateSystem: 1900 | 1904,
): number {
    const fraction = timeFraction(parts);
    if (dateSystem === 1904) {
        return daysBetween(1904, 1, 1, parts) + fraction;
    }
    const days = daysBetween(1900, 1, 1, parts);
    const onOrAfterMarch =
        parts.year > 1900 ||
        (parts.year === 1900 &&
            (parts.month > 3 || (parts.month === 3 && parts.day >= 1)));
    return days + (onOrAfterMarch ? 2 : 1) + fraction;
}

/**
 * Converts a spreadsheet serial to a calendar date and time of day.
 *
 * Serial 60 in the 1900 system is the fictional 1900-02-29 and becomes
 * 1900-03-01. Serial 61 is also 1900-03-01.
 *
 * @param serial - The serial number.
 * @param dateSystem - `1900` or `1904`.
 * @returns The calendar date and time of day.
 */
export function partsFromSerial(
    serial: number,
    dateSystem: 1900 | 1904,
): ExcelDateParts {
    const wholeDays = Math.floor(serial);
    const fraction = serial - wholeDays;
    const daysFromEpoch =
        dateSystem === 1904
            ? wholeDays
            : wholeDays > 60
              ? wholeDays - 2
              : wholeDays - 1;
    const epochYear = dateSystem === 1904 ? 1904 : 1900;
    const calendar = addGregorianDays(epochYear, 1, 1, daysFromEpoch);
    const milliseconds = Math.round(fraction * millisecondsPerDay);
    const hour = Math.floor(milliseconds / 3_600_000);
    const minute = Math.floor((milliseconds % 3_600_000) / 60_000);
    const second = Math.floor((milliseconds % 60_000) / 1_000);
    const millisecond = milliseconds % 1_000;
    return { ...calendar, hour, minute, second, millisecond };
}

/**
 * @param year - Epoch year.
 * @param month - Epoch month.
 * @param day - Epoch day.
 * @param parts - The later calendar date.
 * @returns Whole days from the epoch date to `parts`.
 */
function daysBetween(
    year: number,
    month: number,
    day: number,
    parts: CalendarDate,
): number {
    const start = UTCEpochMilliseconds(year, month - 1, day, 0, 0, 0, 0);
    const current = UTCEpochMilliseconds(
        parts.year,
        parts.month - 1,
        parts.day,
        0,
        0,
        0,
        0,
    );
    return Math.round((current - start) / millisecondsPerDay);
}

/**
 * @param parts - A time of day.
 * @returns The fraction of a 24-hour day.
 */
function timeFraction(parts: TimeOfDay): number {
    return (
        ((parts.hour * 60 + parts.minute) * 60 +
            parts.second +
            parts.millisecond / 1_000) /
        86_400
    );
}
