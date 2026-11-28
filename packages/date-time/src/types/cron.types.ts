/**
 * A parsed cron schedule.
 *
 * Day-of-week numbers follow cron: `0` and `7` are Sunday, normalized to
 * `0`. When both the day of the month and the day of the week are lists
 * rather than `"any"`, a time matches if either field matches.
 */
export interface CronSchedule {
    expression: string;
    seconds: readonly number[];
    minutes: readonly number[];
    hours: readonly number[];
    daysOfMonth: readonly number[] | "any";
    months: readonly number[];
    daysOfWeek: readonly number[] | "any";
    lastDayOfMonth: boolean;
    lastDayOfMonthOffset?: number;
    nearestWeekdayToDay?: number;
    lastWeekdayOfMonth: boolean;
    nthWeekdayOfMonth?: readonly { dayOfWeek: number; occurrence: number }[];
    lastWeekdayOfWeekInMonth?: readonly number[];
}
