import { isRealDate } from "../utils/date-input.utils.js";
import { parseStrictDateString } from "../utils/date-string.utils.js";
import { UTCEpochMilliseconds } from "../utils/gregorian.utils.js";

/**
 * A `JSON.parse` reviver that turns strict ISO date-times into dates.
 *
 * Only a date-time with an offset is converted. A date-only string and
 * every other value are returned unchanged.
 *
 * @param _key - The object key `JSON.parse` is visiting. It is not used.
 * @param value - The value at that key.
 * @returns A `Date` when `value` is a strict offset date-time, otherwise `value`.
 * @example
 * JSON.parse("\\"2026-11-26T03:30:00+05:30\\"", reviveISODateTimes); // a Date at 2026-11-25T22:00:00.000Z
 */
export function reviveISODateTimes(_key: string, value: unknown): unknown {
    if (typeof value !== "string") {
        return value;
    }
    const parsed = parseStrictDateString(value);
    if (parsed?.offsetMinutes === undefined || !isRealDate(value)) {
        return value;
    }
    if (!value.includes("T") && !value.includes("t")) {
        return value;
    }
    const utc = UTCEpochMilliseconds(
        parsed.year,
        parsed.month - 1,
        parsed.day,
        parsed.hour,
        parsed.minute,
        parsed.second,
        parsed.millisecond,
    );
    return new Date(utc - parsed.offsetMinutes * 60_000);
}
