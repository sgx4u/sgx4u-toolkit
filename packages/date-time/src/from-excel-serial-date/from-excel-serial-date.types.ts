import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link fromExcelSerialDate}.
 */
export interface FromExcelSerialDateParams extends TimeZoneOptions {
    /**
     * The spreadsheet serial number.
     */
    serial: number;
    /**
     * Which epoch the serial uses.
     *
     * @defaultValue `1900`
     */
    dateSystem?: 1900 | 1904;
}