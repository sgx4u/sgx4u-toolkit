import type { DateInput } from "../types/date-input.types.js";
import type { IsBetweenOptions } from "./is-between.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Reports whether `date` lies between `start` and `end`.
 *
 * Both ends are included unless the matching option is `false`. When
 * `start` is after `end`, no instant is inside the range.
 *
 * @param date - The date to test.
 * @param start - One end of the range.
 * @param end - The other end of the range.
 * @param options - `includeStart` and `includeEnd` both default to `true`.
 * @returns `true` when `date` is inside the range.
 * @throws {@link TypeError} When a value has the wrong type.
 * @throws {@link RangeError} When a value is not a real date.
 * @example
 * isBetween("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z", "2024-01-03T00:00:00Z"); // true
 */
export function isBetween(
    date: DateInput,
    start: DateInput,
    end: DateInput,
    options?: IsBetweenOptions,
): boolean {
    const instant = resolveDateInput(date, "date").getTime();
    const startInstant = resolveDateInput(start, "start").getTime();
    const endInstant = resolveDateInput(end, "end").getTime();
    const includeStart = options?.includeStart ?? true;
    const includeEnd = options?.includeEnd ?? true;
    const afterStart = includeStart
        ? instant >= startInstant
        : instant > startInstant;
    const beforeEnd = includeEnd ? instant <= endInstant : instant < endInstant;
    return afterStart && beforeEnd;
}
