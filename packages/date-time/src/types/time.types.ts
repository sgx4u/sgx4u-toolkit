/**
 * ISO weekday number. `1` is Monday and `7` is Sunday.
 */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A calendar or clock unit used by arithmetic, differences, and rounding.
 *
 * `"decade"` is not a member. `startOfUnit` and `endOfUnit` accept it on
 * their own.
 */
export type TimeUnit =
    | "year"
    | "quarter"
    | "month"
    | "week"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "millisecond";

/**
 * A unit measured on the calendar rather than as elapsed time.
 */
export type CalendarUnit = "year" | "quarter" | "month" | "week" | "day";

/**
 * A unit measured as elapsed time.
 */
export type ClockUnit = "hour" | "minute" | "second" | "millisecond";

/**
 * A proleptic Gregorian calendar date. Months are `1` through `12`.
 */
export interface CalendarDate {
    year: number;
    month: number;
    day: number;
}

/**
 * A time of day on a 24-hour clock. `hour` is `0` through `23`.
 */
export interface TimeOfDay {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

/**
 * A daily window. When `end` is earlier than or equal to `start`, the
 * window continues past midnight into the next day.
 */
export interface TimeRange {
    start: string | TimeOfDay;
    end: string | TimeOfDay;
}

/**
 * Wall-clock fields of one instant in one time zone.
 *
 * `weekday` is the ISO number, Monday `1` through Sunday `7`.
 * `offsetMinutes` is the zone's offset from UTC and may include a
 * fraction when the historical offset is not a whole minute.
 */
export interface DateParts extends CalendarDate, TimeOfDay {
    weekday: Weekday;
    offsetMinutes: number;
}

/**
 * Fields used to build an instant. Omitted fields use their minimum:
 * month `1`, day `1`, and time `0`.
 */
export interface DatePartsInput {
    year: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}
