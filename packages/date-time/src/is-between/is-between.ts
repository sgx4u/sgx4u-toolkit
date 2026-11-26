import { readDateInput } from "../utils/date-input.utils.js";
import type { IsBetweenParams } from "./is-between.types.js";

/**
 * Reports whether `date` lies between `start` and `end`.
 *
 * Both ends are included unless the matching field is `false`. When
 * `start` is after `end`, no instant is inside the range.
 *
 * @param params - `date`, `start`, and `end` are required. `includeStart` and `includeEnd` default to `true`.
 * @returns `true` when `date` is inside the range.
 * @example
 * isBetween({ date: "2024-01-02T00:00:00Z", start: "2024-01-01T00:00:00Z", end: "2024-01-03T00:00:00Z" }); // true
 */
export function isBetween({
    date,
    start,
    end,
    includeStart = true,
    includeEnd = true,
}: IsBetweenParams): boolean {
    const instant = readDateInput(date);
    const startInstant = readDateInput(start);
    const endInstant = readDateInput(end);
    if (
        instant === undefined ||
        startInstant === undefined ||
        endInstant === undefined
    ) {
        return false;
    }
    const instantTime = instant.getTime();
    const startTime = startInstant.getTime();
    const endTime = endInstant.getTime();
    const afterStart = includeStart
        ? instantTime >= startTime
        : instantTime > startTime;
    const beforeEnd = includeEnd
        ? instantTime <= endTime
        : instantTime < endTime;
    return afterStart && beforeEnd;
}
