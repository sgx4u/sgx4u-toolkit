import type { DateInput } from "../types/date-input.types.js";
import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * Fields for {@link getFiscalQuarter}.
 */
export interface GetFiscalQuarterParams
    extends FiscalYearOptions,
        TimeZoneOptions {
    /**
     * The date to read.
     */
    date: DateInput;
}