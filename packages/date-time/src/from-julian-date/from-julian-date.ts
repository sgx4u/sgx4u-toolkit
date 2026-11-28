const maximumTimeValue = 8_640_000_000_000_000;

/**
 * Returns a date from an astronomical Julian Date.
 *
 * @param julianDate - The Julian Date.
 * @returns A new `Date`, or `undefined` when the value is not usable.
 * @example
 * fromJulianDate(2440587.5)?.toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromJulianDate(julianDate: number): Date | undefined {
    if (typeof julianDate !== "number" || !Number.isFinite(julianDate)) {
        return undefined;
    }
    const milliseconds = (julianDate - 2_440_587.5) * 86_400_000;
    if (Math.abs(milliseconds) > maximumTimeValue) {
        return undefined;
    }
    const date = new Date(milliseconds);
    if (!Number.isFinite(date.getTime())) {
        return undefined;
    }
    return date;
}
