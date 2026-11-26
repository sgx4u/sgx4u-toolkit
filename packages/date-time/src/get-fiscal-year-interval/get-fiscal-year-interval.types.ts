import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * Fields for {@link getFiscalYearInterval}.
 */
export interface GetFiscalYearIntervalParams
    extends FiscalYearOptions,
        TimeZoneOptions {
    /**
     * The fiscal year label, such as 2027 for an April-to-March year.
     */
    fiscalYear: number;
}