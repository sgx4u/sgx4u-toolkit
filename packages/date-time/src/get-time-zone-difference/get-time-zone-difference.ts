import { getUTCOffset } from "../get-utc-offset/get-utc-offset.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import type { GetTimeZoneDifferenceParams } from "./get-time-zone-difference.types.js";

/**
 * Returns how many minutes the first zone is ahead of the second.
 *
 * @param params - `firstTimeZone` and `secondTimeZone` are required. `at` defaults to now.
 * @returns Minutes, or `undefined` when `at` is not usable. A negative number means the first zone is behind.
 * @throws {@link RangeError} When a zone is unknown.
 * @example
 * getTimeZoneDifference({
 *   firstTimeZone: "Asia/Kolkata",
 *   secondTimeZone: "UTC",
 *   at: "2026-01-01T00:00:00Z",
 * }); // 330
 */
export function getTimeZoneDifference({
    firstTimeZone,
    secondTimeZone,
    at,
}: GetTimeZoneDifferenceParams): number | undefined {
    const first = assertTimeZoneName(firstTimeZone, "firstTimeZone");
    const second = assertTimeZoneName(secondTimeZone, "secondTimeZone");
    const instant =
        at === undefined ? resolveNow(undefined) : readDateInput(at);
    if (instant === undefined) {
        return undefined;
    }
    const firstOffset = getUTCOffset({ date: instant, timeZone: first });
    const secondOffset = getUTCOffset({ date: instant, timeZone: second });
    if (firstOffset === undefined || secondOffset === undefined) {
        return undefined;
    }
    return firstOffset - secondOffset;
}
