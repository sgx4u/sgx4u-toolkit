import type { Interval } from "../types/interval.types.js";
import {
    fiscalStartCalendarYear,
    readFiscalSettings,
} from "../utils/fiscal.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { GetFiscalYearIntervalParams } from "./get-fiscal-year-interval.types.js";

/**
 * Returns the half-open interval of a fiscal year.
 *
 * The end is the first instant of the next fiscal year.
 *
 * @param params - `fiscalYearStartMonth` is required; `timeZone` defaults to the system zone.
 * @returns `{ start, end }` in the zone, or `undefined` when `fiscalYear` is not an integer.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month or `timeZone` is not usable.
 * @example
 * getFiscalYearInterval({ fiscalYear: 2027, fiscalYearStartMonth: 4, timeZone: "UTC" })?.start.toISOString(); // "2026-04-01T00:00:00.000Z"
 */
export function getFiscalYearInterval(
    params: GetFiscalYearIntervalParams,
): Interval | undefined {
    const settings = readFiscalSettings(params);
    if (
        typeof params.fiscalYear !== "number" ||
        !Number.isInteger(params.fiscalYear)
    ) {
        return undefined;
    }
    const timeZone = resolveTimeZone(params.timeZone);
    const startYear = fiscalStartCalendarYear(params.fiscalYear, settings);
    const start = instantFromWallTime(
        {
            year: startYear,
            month: settings.startMonth,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        },
        timeZone,
        "compatible",
    );
    const end = instantFromWallTime(
        {
            year: startYear + 1,
            month: settings.startMonth,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        },
        timeZone,
        "compatible",
    );
    return { start: new Date(start), end: new Date(end) };
}