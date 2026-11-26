import type { TimeZoneTransition } from "../types/time-zone.types.js";
import { getUTCOffset } from "../get-utc-offset/get-utc-offset.js";

const stepMilliseconds = 6 * 3_600_000;
const millisecondsPerMinute = 60_000;

/**
 * Offset changes inside `[start, end)`.
 *
 * The scan steps at most six hours, then binary-searches to the millisecond.
 *
 * @param start - The first instant to consider.
 * @param end - The exclusive end.
 * @param timeZone - An IANA zone or fixed offset.
 * @returns The transitions, oldest first.
 */
export function transitionsBetween(
    start: number,
    end: number,
    timeZone: string,
): TimeZoneTransition[] {
    const transitions: TimeZoneTransition[] = [];
    let cursor = start;
    let offset = offsetMilliseconds(cursor, timeZone);
    while (cursor < end) {
        const probe = Math.min(cursor + stepMilliseconds, end);
        const probeOffset = offsetMilliseconds(probe, timeZone);
        if (probeOffset === offset) {
            cursor = probe;
            continue;
        }
        let low = cursor;
        let high = probe;
        while (high - low > 1) {
            const middle = low + Math.floor((high - low) / 2);
            if (offsetMilliseconds(middle, timeZone) === offset) {
                low = middle;
            } else {
                high = middle;
            }
        }
        const offsetAfter = offsetMilliseconds(high, timeZone);
        if (offsetAfter !== offset && high < end) {
            transitions.push({
                instant: new Date(high),
                offsetMinutesBefore: offset / millisecondsPerMinute,
                offsetMinutesAfter: offsetAfter / millisecondsPerMinute,
            });
            offset = offsetAfter;
            cursor = high;
            continue;
        }
        cursor = probe;
        offset = probeOffset;
    }
    return transitions;
}

/**
 * @param epochMilliseconds - The instant.
 * @param timeZone - The zone.
 * @returns The offset in whole milliseconds.
 */
function offsetMilliseconds(
    epochMilliseconds: number,
    timeZone: string,
): number {
    return Math.round(
        (getUTCOffset({ date: new Date(epochMilliseconds), timeZone }) ?? 0) *
            millisecondsPerMinute,
    );
}
