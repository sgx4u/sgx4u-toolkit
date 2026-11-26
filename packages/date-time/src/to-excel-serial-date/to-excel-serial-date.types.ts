import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Which spreadsheet epoch a serial uses.
 */
export interface ExcelDateOptions extends TimeZoneOptions {
    /**
     * `1900` includes the fictional leap day. `1904` starts at 1904-01-01.
     *
     * @defaultValue `1900`
     */
    dateSystem?: 1900 | 1904;
}

/**
 * Fields for {@link toExcelSerialDate}.
 */
export interface ToExcelSerialDateParams extends ExcelDateOptions {
    /**
     * The instant to convert.
     */
    date: DateInput;
}
