import { assertFiniteNumber } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";

const maximumTimeValue = 8_640_000_000_000_000;

/**
 * Returns a date from an astronomical Julian Date.
 *
 * @param julianDate - The Julian Date.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `julianDate` is not a number.
 * @throws {@link RangeError} When the instant is outside the range `Date` can store.
 * @example
 * fromJulianDate(2440587.5).toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromJulianDate(julianDate: number): Date {
    const value = assertFiniteNumber(julianDate, "julianDate");
    const milliseconds = (value - 2_440_587.5) * 86_400_000;
    if (Math.abs(milliseconds) > maximumTimeValue) {
        throw rangeError("julianDate", "a time Date can store", julianDate);
    }
    const date = new Date(milliseconds);
    if (!Number.isFinite(date.getTime())) {
        throw rangeError("julianDate", "a time Date can store", julianDate);
    }
    return date;
}
