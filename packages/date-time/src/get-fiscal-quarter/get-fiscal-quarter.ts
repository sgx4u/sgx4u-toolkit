import { readDateInput } from "../utils/date-input.utils.js";
import { fiscalQuarterOf, readFiscalSettings } from "../utils/fiscal.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetFiscalQuarterParams } from "./get-fiscal-quarter.types.js";

/**
 * Returns the quarter inside the fiscal year, from 1 through 4.
 *
 * The first quarter starts on `fiscalYearStartMonth`.
 *
 * @param params - `fiscalYearStartMonth` is required; `timeZone` defaults to the system zone.
 * @returns `1`, `2`, `3`, or `4`, or `undefined` when `date` is not usable.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month or `timeZone` is not usable.
 * @example
 * getFiscalQuarter({ date: "2026-04-01T00:00:00Z", fiscalYearStartMonth: 4, timeZone: "UTC" }); // 1
 */
export function getFiscalQuarter(
    params: GetFiscalQuarterParams,
): 1 | 2 | 3 | 4 | undefined {
    const settings = readFiscalSettings(params);
    const timeZone = resolveTimeZone(params.timeZone);
    const instant = readDateInput(params.date, timeZone);
    if (instant === undefined) {
        return undefined;
    }
    const parts = readDateParts(instant.getTime(), timeZone);
    return fiscalQuarterOf(parts, settings);
}
