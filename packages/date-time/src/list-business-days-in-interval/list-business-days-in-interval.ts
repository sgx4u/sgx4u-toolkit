import type { BusinessCalendar } from "../types/business.types.js";
import type { Interval } from "../types/interval.types.js";
import {
    startOfInstant,
    addDurationToInstant,
} from "../utils/arithmetic.utils.js";
import {
    isBusinessInstant,
    resolveBusinessCalendar,
} from "../utils/business.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";

const maximumResultCount = 100_000;

/**
 * Lists the start of each business day that overlaps an interval.
 *
 * @param interval - The half-open interval.
 * @param calendar - Weekend days, holidays, and the zone.
 * @returns A new array, oldest first.
 * @throws {@link RangeError} When the result would exceed 100000 days.
 * @example
 * listBusinessDaysInInterval(
 *   { start: new Date("2026-11-27T00:00:00Z"), end: new Date("2026-11-30T00:00:00Z") },
 *   { timeZone: "UTC" },
 * ).length; // 1
 */
export function listBusinessDaysInInterval(
    interval: Interval,
    calendar?: BusinessCalendar,
): Date[] {
    const resolved = resolveBusinessCalendar(calendar);
    const checked = readInterval(interval);
    let cursor = startOfInstant(
        checked.start.getTime(),
        "day",
        resolved.timeZone,
        1,
    );
    const dates: Date[] = [];
    while (cursor < checked.end.getTime()) {
        const next = addDurationToInstant(
            cursor,
            { days: 1 },
            resolved.timeZone,
            "compatible",
            "constrain",
        );
        if (
            next > checked.start.getTime() &&
            isBusinessInstant(cursor, resolved)
        ) {
            dates.push(new Date(cursor));
            if (dates.length > maximumResultCount) {
                throw rangeError(
                    "interval",
                    "at most 100000 business days",
                    interval,
                );
            }
        }
        cursor = next;
    }
    return dates;
}
