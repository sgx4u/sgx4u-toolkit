const maximumTimeValue = 8_640_000_000_000_000;

/**
 * Returns a date from whole or fractional Unix seconds.
 *
 * @param seconds - Seconds since the Unix epoch.
 * @returns A new `Date`, or `undefined` when the value is not usable.
 * @example
 * fromUnixSeconds(0)?.toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromUnixSeconds(seconds: number): Date | undefined {
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
        return undefined;
    }
    const milliseconds = seconds * 1000;
    if (Math.abs(milliseconds) > maximumTimeValue) {
        return undefined;
    }
    const date = new Date(milliseconds);
    if (!Number.isFinite(date.getTime())) {
        return undefined;
    }
    return date;
}