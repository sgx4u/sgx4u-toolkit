import type { DateInput } from "../types/date-input.types.js";
import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { fiscalYearOf, readFiscalSettings } from "../utils/fiscal.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the fiscal year label for a date.
 *
 * With a start month of April and the default `"end-year"` label, 1 April
 * 2026 through 31 March 2027 is fiscal year 2027. `"start-year"` labels
 * that span 2026. A start month of January matches the calendar year.
 *
 * @param date - The date to label.
 * @param options - `fiscalYearStartMonth` is required.
 * @returns The fiscal year number.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month is outside 1 through 12.
 * @example
 * getFiscalYear("2026-04-01T00:00:00Z", { fiscalYearStartMonth: 4, timeZone: "UTC" }); // 2027
 */
export function getFiscalYear(
    date: DateInput,
    options: FiscalYearOptions & TimeZoneOptions,
): number {
    const settings = readFiscalSettings(options);
    const timeZone = resolveTimeZone(options.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return fiscalYearOf(parts, settings);
}
