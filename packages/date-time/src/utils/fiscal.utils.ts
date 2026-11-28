import type { CalendarDate } from "../types/time.types.js";
import { assertIntegerInRange } from "./assert.utils.js";
import { rangeError, typeError } from "./error.utils.js";

/**
 * Which calendar year labels a fiscal year.
 */
export type FiscalYearLabel = "start-year" | "end-year";

/**
 * A checked fiscal-year configuration.
 */
export interface FiscalSettings {
    startMonth: number;
    label: FiscalYearLabel;
}

/**
 * @param options - The caller's fiscal options. `fiscalYearStartMonth` is required.
 * @returns The start month and label.
 * @throws {@link TypeError} When the options or the start month are missing.
 * @throws {@link RangeError} When the start month is outside 1 through 12.
 */
export function readFiscalSettings(
    options:
        | {
              fiscalYearStartMonth?: number;
              fiscalYearLabel?: FiscalYearLabel;
          }
        | undefined,
): FiscalSettings {
    if (options === undefined || options === null) {
        throw typeError(
            "options",
            "an object with fiscalYearStartMonth",
            options,
        );
    }
    if (options.fiscalYearStartMonth === undefined) {
        throw typeError(
            "fiscalYearStartMonth",
            "a month from 1 to 12",
            undefined,
        );
    }
    const label = options.fiscalYearLabel ?? "end-year";
    if (label !== "start-year" && label !== "end-year") {
        throw rangeError(
            "fiscalYearLabel",
            `"start-year" or "end-year"`,
            label,
        );
    }
    return {
        startMonth: assertIntegerInRange(
            options.fiscalYearStartMonth,
            "fiscalYearStartMonth",
            1,
            12,
        ),
        label,
    };
}

/**
 * The fiscal year label for a calendar date.
 *
 * A start month of January makes the fiscal year the calendar year.
 * With April and `"end-year"`, April 2026 through March 2027 is 2027.
 *
 * @param date - The calendar date.
 * @param settings - The fiscal start month and label.
 * @returns The fiscal year number.
 */
export function fiscalYearOf(
    date: CalendarDate,
    settings: FiscalSettings,
): number {
    if (settings.startMonth === 1) {
        return date.year;
    }
    const started = date.month >= settings.startMonth;
    if (settings.label === "end-year") {
        return started ? date.year + 1 : date.year;
    }
    return started ? date.year : date.year - 1;
}

/**
 * The fiscal quarter, from 1 through 4.
 *
 * @param date - The calendar date.
 * @param settings - The fiscal start month. The label does not change the quarter.
 * @returns The quarter inside the fiscal year.
 */
export function fiscalQuarterOf(
    date: CalendarDate,
    settings: FiscalSettings,
): 1 | 2 | 3 | 4 {
    const monthsFromStart = (date.month - settings.startMonth + 12) % 12;
    return (Math.floor(monthsFromStart / 3) + 1) as 1 | 2 | 3 | 4;
}

/**
 * The calendar year in which a labeled fiscal year starts.
 *
 * @param fiscalYear - The label returned by `fiscalYearOf`.
 * @param settings - The fiscal start month and label.
 * @returns The calendar year of the first day.
 */
export function fiscalStartCalendarYear(
    fiscalYear: number,
    settings: FiscalSettings,
): number {
    if (settings.startMonth === 1) {
        return fiscalYear;
    }
    if (settings.label === "end-year") {
        return fiscalYear - 1;
    }
    return fiscalYear;
}
