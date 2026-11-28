import type { Weekday } from "./time.types.js";

/**
 * How often a recurrence repeats.
 */
export type RecurrenceFrequency =
    | "yearly"
    | "monthly"
    | "weekly"
    | "daily"
    | "hourly"
    | "minutely"
    | "secondly";

/**
 * One weekday in a recurrence rule. `occurrence` is the ordinal used by
 * `BYDAY`, such as `2` for the second Monday or `-1` for the last Friday.
 */
export interface RecurrenceWeekday {
    weekday: Weekday;
    occurrence?: number;
}

/**
 * A recurrence rule in the shape of RFC 5545, plus extra and excluded dates.
 *
 * `timeZone` absent means the rule is floating and is evaluated in UTC.
 * `count` and `until` cannot both be set.
 */
export interface RecurrenceRule {
    start: Date;
    timeZone?: string;
    frequency: RecurrenceFrequency;
    /**
     * Number of frequency steps between occurrences.
     *
     * @defaultValue `1`
     */
    interval?: number;
    count?: number;
    until?: Date;
    /**
     * Weekday the week starts on, the `WKST` part.
     *
     * @defaultValue `1`
     */
    weekStart?: Weekday;
    byMonth?: readonly number[];
    byWeekNumber?: readonly number[];
    byYearDay?: readonly number[];
    byMonthDay?: readonly number[];
    byWeekday?: readonly RecurrenceWeekday[];
    byHour?: readonly number[];
    byMinute?: readonly number[];
    bySecond?: readonly number[];
    bySetPosition?: readonly number[];
    /**
     * Extra instants to include, the `RDATE` lines.
     */
    additionalDates?: readonly Date[];
    /**
     * Instants to leave out, the `EXDATE` lines.
     */
    excludedDates?: readonly Date[];
}
