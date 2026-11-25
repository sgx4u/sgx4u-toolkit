import { getUtcOffset } from "../get-utc-offset/get-utc-offset.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";
import { assertTimeZoneName } from "../utils/time-zone.utils.js";
import type { TimeZoneDifferenceOptions } from "./get-time-zone-difference.types.js";

/**
 * Returns how many minutes the first zone is ahead of the second.
 *
 * @param firstTimeZone - The zone being compared.
 * @param secondTimeZone - The zone it is compared with.
 * @param options - `at` defaults to the current time.
 * @returns Minutes. A negative number means the first zone is behind.
 * @throws {@link RangeError} When a zone is unknown.
 * @example
 * getTimeZoneDifference("Asia/Kolkata", "UTC", { at: "2026-01-01T00:00:00Z" }); // 330
 */
export function getTimeZoneDifference(
    firstTimeZone: string,
    secondTimeZone: string,
    options?: TimeZoneDifferenceOptions,
): number {
    const first = assertTimeZoneName(firstTimeZone, "firstTimeZone");
    const second = assertTimeZoneName(secondTimeZone, "secondTimeZone");
    const instant =
        options?.at === undefined
            ? resolveNow(undefined)
            : resolveDateInput(options.at, "at");
    return getUtcOffset(instant, first) - getUtcOffset(instant, second);
}
