import { readDateInput } from "../utils/date-input.utils.js";
import { fiscalYearOf, readFiscalSettings } from "../utils/fiscal.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetFiscalYearParams } from "./get-fiscal-year.types.js";

/**
 * Returns the fiscal year label for a date.
 *
 * With a start month of April and the default `"end-year"` label, 1 April
 * 2026 through 31 March 2027 is fiscal year 2027. `"start-year"` labels
 * that span 2026. A start month of January matches the calendar year.
 *
 * @param params - `fiscalYearStartMonth` is required; `timeZone` defaults to the system zone.
 * @returns The fiscal year number, or `undefined` when `date` is not usable.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month or `timeZone` is not usable.
 * @example
 * getFiscalYear({ date: "2026-04-01T00:00:00Z", fiscalYearStartMonth: 4, timeZone: "UTC" }); // 2027
 */
export function getFiscalYear(
    params: GetFiscalYearParams,
): number | undefined {
    const settings = readFiscalSettings(params);
    const timeZone = resolveTimeZone(params.timeZone);
    const instant = readDateInput(params.date, timeZone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), timeZone);
    return fiscalYearOf(parts, settings);
}