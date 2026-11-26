import type { BusinessCalendar } from "../types/business.types.js";
import type { DateInput } from "../types/date-input.types.js";
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
 * Fields for {@link listBusinessDaysInInterval}.
 */
export interface ListBusinessDaysInIntervalParams extends BusinessCalendar {
    /**
     * The inclusive start of the half-open interval.
     */
    start: DateInput;
    /**
     * The exclusive end of the half-open interval.
     */
    end: DateInput;
}

/**
 * Lists the start of each business day that overlaps an interval.
 *
 * @param params - `start` and `end` bound the interval. `workingDays`, `businessHours`, `holidays`, and `timeZone` follow {@link BusinessCalendar}.
 * @returns A new array, oldest first.
 * @throws {@link RangeError} When the result would exceed 100000 days.
 * @example
 * listBusinessDaysInInterval({
 *   start: new Date("2026-11-27T00:00:00Z"),
 *   end: new Date("2026-11-30T00:00:00Z"),
 *   timeZone: "UTC",
 * }).length; // 1
 */
export function listBusinessDaysInInterval({
    start,
    end,
    workingDays,
    businessHours,
    holidays,
    timeZone,
}: ListBusinessDaysInIntervalParams): Date[] {
    const resolved = resolveBusinessCalendar({
        ...(workingDays !== undefined ? { workingDays } : {}),
        ...(businessHours !== undefined ? { businessHours } : {}),
        ...(holidays !== undefined ? { holidays } : {}),
        ...(timeZone !== undefined ? { timeZone } : {}),
    });
    const checked = readInterval({ start, end });
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
                    { start, end },
                );
            }
        }
        cursor = next;
    }
    return dates;
}