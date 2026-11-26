import type { DateInput } from "../types/date-input.types.js";
import type {
    FiscalYearOptions,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * Fields for {@link getFiscalYear}.
 */
export interface GetFiscalYearParams extends FiscalYearOptions, TimeZoneOptions {
    /**
     * The date to label.
     */
    date: DateInput;
}