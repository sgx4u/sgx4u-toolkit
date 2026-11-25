import type { DateInput } from "../types/date-input.types.js";
import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { fiscalQuarterOf, readFiscalSettings } from "../utils/fiscal.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the quarter inside the fiscal year, from 1 through 4.
 *
 * The first quarter starts on `fiscalYearStartMonth`.
 *
 * @param date - The date to read.
 * @param options - `fiscalYearStartMonth` is required.
 * @returns `1`, `2`, `3`, or `4`.
 * @throws {@link TypeError} When `fiscalYearStartMonth` is missing.
 * @throws {@link RangeError} When the start month is outside 1 through 12.
 * @example
 * getFiscalQuarter("2026-04-01T00:00:00Z", { fiscalYearStartMonth: 4, timeZone: "UTC" }); // 1
 */
export function getFiscalQuarter(
    date: DateInput,
    options: FiscalYearOptions & TimeZoneOptions,
): 1 | 2 | 3 | 4 {
    const settings = readFiscalSettings(options);
    const timeZone = resolveTimeZone(options.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    return fiscalQuarterOf(parts, settings);
}
