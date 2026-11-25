import type { TimeZoneOptions } from "../types/options.types.js";
import { assertFiniteNumber } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { partsFromSerial } from "../utils/excel.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { readDateSystem } from "../to-excel-serial-date/to-excel-serial-date.js";

/**
 * Returns the date named by a spreadsheet serial number.
 *
 * In the 1900 system, serial 1 is 1900-01-01 and both 60 and 61 are
 * 1900-03-01. The fraction is the time of day in `timeZone`.
 *
 * @param serial - The serial number.
 * @param options - `dateSystem` defaults to `1900`.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `serial` is not a number.
 * @throws {@link RangeError} When the serial is below the epoch.
 * @example
 * fromExcelSerialDate(61, { timeZone: "UTC" }).toISOString(); // "1900-03-01T00:00:00.000Z"
 */
export function fromExcelSerialDate(
    serial: number,
    options?: TimeZoneOptions & { dateSystem?: 1900 | 1904 },
): Date {
    const value = assertFiniteNumber(serial, "serial");
    const dateSystem = readDateSystem(options?.dateSystem);
    if (dateSystem === 1900 && value < 1) {
        throw rangeError(
            "serial",
            "at least 1 in the 1900 date system",
            serial,
        );
    }
    if (dateSystem === 1904 && value < 0) {
        throw rangeError(
            "serial",
            "at least 0 in the 1904 date system",
            serial,
        );
    }
    const parts = partsFromSerial(value, dateSystem);
    return new Date(
        instantFromWallTime(
            parts,
            resolveTimeZone(options?.timeZone),
            "compatible",
        ),
    );
}
