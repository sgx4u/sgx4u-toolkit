import type { TimeUnit } from "../types/time.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { startOfInstant } from "../utils/arithmetic.utils.js";
import { readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";
import {
    resolveTimeZone,
    resolveWeekStartsOn,
} from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { ListDatesInIntervalParams } from "./list-dates-in-interval.types.js";

const maximumResultCount = 100_000;

const oneUnit: Readonly<Record<TimeUnit, Record<string, number>>> = {
    year: { years: 1 },
    quarter: { months: 3 },
    month: { months: 1 },
    week: { weeks: 1 },
    day: { days: 1 },
    hour: { hours: 1 },
    minute: { minutes: 1 },
    second: { seconds: 1 },
    millisecond: { milliseconds: 1 },
};

/**
 * Lists the dates inside an interval.
 *
 * The start is included and the end is excluded. With `alignToUnit`, the
 * first date is the first unit start at or after `start`.
 *
 * @param params - `start` and `end` bound the interval. `step` defaults to one day.
 * @returns A new array of dates, or `undefined` when `step` is not usable or a step does not advance time.
 * @throws {@link RangeError} When the result would exceed 100000 dates, `alignToUnit` is unknown, or `weekStartsOn` or `timeZone` is invalid.
 * @example
 * listDatesInInterval({ start: new Date("2026-01-01T00:00:00Z"), end: new Date("2026-01-03T00:00:00Z"), timeZone: "UTC" })?.length; // 2
 */
export function listDatesInInterval({
    start,
    end,
    step: stepInput,
    timeZone,
    weekStartsOn,
    alignToUnit,
}: ListDatesInIntervalParams): Date[] | undefined {
    const checked = readInterval({ start, end });
    const step = readDuration(stepInput ?? { days: 1 });
    if (step === undefined) {
        return undefined;
    }
    const zone = resolveTimeZone(timeZone);
    const weekStart = resolveWeekStartsOn(weekStartsOn);
    let cursor = checked.start.getTime();
    if (alignToUnit !== undefined) {
        const unit = assertTimeUnit(alignToUnit, "alignToUnit");
        cursor = firstUnitStartAtOrAfter(cursor, unit, zone, weekStart);
    }
    const intervalEnd = checked.end.getTime();
    const dates: Date[] = [];
    while (cursor < intervalEnd) {
        dates.push(new Date(cursor));
        if (dates.length > maximumResultCount) {
            throw rangeError("interval", "at most 100000 dates", {
                start,
                end,
            });
        }
        const nextDate = addDuration({
            date: new Date(cursor),
            duration: step,
            timeZone: zone,
        });
        if (nextDate === undefined) {
            return undefined;
        }
        const next = nextDate.getTime();
        if (next <= cursor) {
            throw rangeError(
                "step",
                "a duration that moves time forward",
                step,
            );
        }
        cursor = next;
    }
    return dates;
}

/**
 * @param epochMilliseconds - The interval start.
 * @param unit - The unit to align to.
 * @param timeZone - Zone the unit is measured in.
 * @param weekStartsOn - ISO weekday that starts a week.
 * @returns The first unit start that is not before the instant.
 */
function firstUnitStartAtOrAfter(
    epochMilliseconds: number,
    unit: TimeUnit,
    timeZone: string,
    weekStartsOn: ReturnType<typeof resolveWeekStartsOn>,
): number {
    const aligned = startOfInstant(
        epochMilliseconds,
        unit,
        timeZone,
        weekStartsOn,
    );
    if (aligned >= epochMilliseconds) {
        return aligned;
    }
    const nextDate = addDuration({
        date: new Date(aligned),
        duration: oneUnit[unit],
        timeZone,
    });
    return nextDate?.getTime() ?? epochMilliseconds;
}
