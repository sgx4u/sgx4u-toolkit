import { assertFiniteNumber } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";

const maximumTimeValue = 8_640_000_000_000_000;

/**
 * Returns a date from whole or fractional Unix seconds.
 *
 * @param seconds - Seconds since the Unix epoch.
 * @returns A new `Date`.
 * @throws {@link TypeError} When `seconds` is not a number.
 * @throws {@link RangeError} When the instant is outside the range `Date` can store.
 * @example
 * fromUnixSeconds(0).toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromUnixSeconds(seconds: number): Date {
    const value = assertFiniteNumber(seconds, "seconds");
    const milliseconds = value * 1000;
    if (Math.abs(milliseconds) > maximumTimeValue) {
        throw rangeError("seconds", "a time Date can store", seconds);
    }
    const date = new Date(milliseconds);
    if (!Number.isFinite(date.getTime())) {
        throw rangeError("seconds", "a time Date can store", seconds);
    }
    return date;
}
