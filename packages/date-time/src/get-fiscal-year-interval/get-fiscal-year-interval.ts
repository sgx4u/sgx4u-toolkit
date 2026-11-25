import type { Interval } from "../types/interval.types.js";
import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import { assertInteger } from "../utils/assert.utils.js";
import {
    fiscalStartCalendarYear,
    readFiscalSettings,
} from "../utils/fiscal.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Returns the half-open interval of a fiscal year.
 *
 * The end is the first instant of the next fiscal year.
 *
 * @param fiscalYear - The label, such as 2027 for an April-to-March year.
 * @param options - `fiscalYearStartMonth` is required.
 * @returns `{ start, end }` in the zone.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month is outside 1 through 12.
 * @example
 * getFiscalYearInterval(2027, { fiscalYearStartMonth: 4, timeZone: "UTC" }).start.toISOString(); // "2026-04-01T00:00:00.000Z"
 */
export function getFiscalYearInterval(
    fiscalYear: number,
    options: FiscalYearOptions & TimeZoneOptions,
): Interval {
    const settings = readFiscalSettings(options);
    const year = assertInteger(fiscalYear, "fiscalYear");
    const timeZone = resolveTimeZone(options.timeZone);
    const startYear = fiscalStartCalendarYear(year, settings);
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
