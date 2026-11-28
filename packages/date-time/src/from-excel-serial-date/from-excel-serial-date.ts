import { partsFromSerial } from "../utils/excel.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { readDateSystem } from "../to-excel-serial-date/to-excel-serial-date.js";
import type { FromExcelSerialDateParams } from "./from-excel-serial-date.types.js";

/**
 * Returns the date named by a spreadsheet serial number.
 *
 * In the 1900 system, serial 1 is 1900-01-01 and both 60 and 61 are
 * 1900-03-01. The fraction is the time of day in `timeZone`.
 *
 * @param params - `serial` is the spreadsheet value; `dateSystem` defaults to `1900`.
 * @returns A new `Date`, or `undefined` when `serial` is not usable.
 * @throws {@link RangeError} When `dateSystem` is not `1900` or `1904`, or `timeZone` is not usable.
 * @example
 * fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString(); // "1900-03-01T00:00:00.000Z"
 */
export function fromExcelSerialDate({
    serial,
    timeZone,
    dateSystem,
}: FromExcelSerialDateParams): Date | undefined {
    if (typeof serial !== "number" || !Number.isFinite(serial)) {
        return undefined;
    }
    const system = readDateSystem(dateSystem);
    if (system === 1900 && serial < 1) {
        return undefined;
    }
    if (system === 1904 && serial < 0) {
        return undefined;
    }
    const parts = partsFromSerial(serial, system);
    return new Date(
        instantFromWallTime(parts, resolveTimeZone(timeZone), "compatible"),
    );
}
