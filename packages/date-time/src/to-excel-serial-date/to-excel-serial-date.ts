import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { serialFromParts } from "../utils/excel.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { ToExcelSerialDateParams } from "./to-excel-serial-date.types.js";

/**
 * Returns the spreadsheet serial number of a date.
 *
 * The integer is the calendar day in `timeZone` and the fraction is the
 * time of day. The 1900 system never returns 60 and returns 61 for
 * 1900-03-01. A date before the epoch throws.
 *
 * @param params - `date` is required. `dateSystem` defaults to `1900`.
 * @returns The serial number, or `undefined` when `date` is not a real date.
 * @throws {@link RangeError} When the date is before the epoch, `dateSystem` is not 1900 or 1904, or `timeZone` is invalid.
 * @example
 * toExcelSerialDate({ date: "1900-03-01T00:00:00Z", timeZone: "UTC" }); // 61
 */
export function toExcelSerialDate({
    date,
    timeZone,
    dateSystem: dateSystemInput,
}: ToExcelSerialDateParams): number | undefined {
    const dateSystem = readDateSystem(dateSystemInput);
    const zone = resolveTimeZone(timeZone);
    const resolved = readDateInput(date, zone);
    if (resolved === undefined) {
        return undefined;
    }
    const parts = readDateParts(resolved.getTime(), zone);
    const serial = serialFromParts(parts, dateSystem);
    if (dateSystem === 1900 && serial < 1) {
        throw rangeError("date", "a date on or after 1900-01-01", date);
    }
    if (dateSystem === 1904 && serial < 0) {
        throw rangeError("date", "a date on or after 1904-01-01", date);
    }
    return serial;
}

/**
 * @param value - The caller's date system.
 * @returns `1900` when the option is omitted.
 * @throws {@link RangeError} When the value is not `1900` or `1904`.
 */
export function readDateSystem(value: 1900 | 1904 | undefined): 1900 | 1904 {
    if (value === undefined) {
        return 1900;
    }
    if (value !== 1900 && value !== 1904) {
        throw rangeError("dateSystem", "1900 or 1904", value);
    }
    return value;
}
