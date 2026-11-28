import type { TimeUnit } from "../types/time.types.js";

/**
 * Calendar and clock units, largest first.
 */
export const timeUnits: readonly TimeUnit[] = [
    "year",
    "quarter",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
];

/**
 * Units that move the wall-clock date rather than the elapsed instant.
 */
export const calendarUnits: readonly TimeUnit[] = [
    "year",
    "quarter",
    "month",
    "week",
    "day",
];

/** Milliseconds in one exact clock unit. A calendar day is not in this map. */
export const millisecondsPerClockUnit: Readonly<
    Record<"hour" | "minute" | "second" | "millisecond", number>
> = {
    hour: 3_600_000,
    minute: 60_000,
    second: 1_000,
    millisecond: 1,
};

/**
 * How many of `unit` fit in the next larger clock or day unit.
 *
 * An increment must divide this number. Days are 24 hours here only for
 * that check; calendar arithmetic does not assume a 24-hour day.
 */
export const clockUnitDivisor: Readonly<
    Record<"hour" | "minute" | "second" | "millisecond", number>
> = {
    hour: 24,
    minute: 60,
    second: 60,
    millisecond: 1_000,
};
