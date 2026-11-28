import type { ConfiguredHoliday } from "./configured-holiday.types.js";
import type { Disambiguation, Overflow } from "./options.types.js";
import type { TimeRange, Weekday } from "./time.types.js";

/**
 * Defaults bound once by `createDateTime` and the subpath factories.
 *
 * Omitted fields keep the built-in default. A per-call field replaces the
 * bound value for that call. There is no module-level default.
 */
export interface DateTimeConfig {
    /**
     * IANA time zone, `"UTC"`, or a fixed offset (`+05:30`, `+0530`, `+05`).
     *
     * @defaultValue The system time zone, read on each call.
     */
    timeZone?: string;
    /**
     * BCP 47 language tag, or tags in preference order.
     *
     * @defaultValue The runtime's default locale.
     */
    locale?: string | readonly string[];
    /**
     * ISO weekday that starts a week. `1` is Monday and `7` is Sunday.
     *
     * @defaultValue `1`
     */
    weekStartsOn?: Weekday;
    /**
     * How many days of the year the first week must contain.
     *
     * `getWeekOfYear` uses this. ISO week functions always use Monday and `4`.
     *
     * @defaultValue `1`
     */
    minimumDaysInFirstWeek?: number;
    /**
     * ISO weekdays that count as business days. Every other weekday is a weekend.
     *
     * @defaultValue `[1, 2, 3, 4, 5]` (Monday through Friday).
     */
    workingDays?: readonly Weekday[];
    /**
     * Working windows on a business day. An empty list means the whole day.
     *
     * @defaultValue `[{ start: "09:00", end: "17:00" }]`
     */
    businessHours?: readonly TimeRange[];
    /**
     * How a skipped or repeated wall time becomes an instant.
     *
     * @defaultValue `"compatible"`
     */
    disambiguation?: Disambiguation;
    /**
     * Clock used when a call does not pass `now`.
     *
     * Each call reads it again, so a test can move the clock without
     * building a new instance. A per-call `now` is a date, and it wins.
     *
     * @defaultValue `() => new Date()`
     */
    now?: () => Date;
    /**
     * Holidays closed by business-day functions and `isHoliday`.
     *
     * A date-only string is that calendar date in `timeZone`. Empty means
     * no holidays. There is no shared holiday list.
     *
     * @defaultValue `[]`
     */
    holidays?: readonly ConfiguredHoliday[];
    /**
     * `numeric` passed to relative-time formatting when a call omits it.
     *
     * @defaultValue `"auto"`
     */
    numeric?: "always" | "auto";
    /**
     * What to do when a calendar day does not exist in the target month.
     *
     * @defaultValue `"constrain"`
     */
    overflow?: Overflow;
    /**
     * Pattern used by `formatDate` when a call omits `pattern`.
     *
     * @defaultValue No pattern. A call must pass `pattern`.
     */
    formatPattern?: string;
    /**
     * Month the fiscal year starts, from `1` through `12`.
     *
     * @defaultValue None. Fiscal calls must pass it unless the config does.
     */
    fiscalYearStartMonth?: number;
    /**
     * Which calendar year labels a fiscal year.
     *
     * @defaultValue `"end-year"`
     */
    fiscalYearLabel?: "start-year" | "end-year";
    /**
     * Width of relative-time text when a call omits `style`.
     *
     * @defaultValue `"long"`
     */
    relativeTimeStyle?: "long" | "short" | "narrow";
}

/**
 * Keys the caller set on a config object, not the keys that are only optional.
 */
export type RequiredConfigKeys<Config> = {
    [Key in keyof Config]-?: undefined extends Config[Key] ? never : Key;
}[keyof Config];

/**
 * Makes config-supplied fields optional on a function's parameter object.
 *
 * A field stays required when this config does not provide it. Fields the
 * config always treats as optional stay optional.
 */
export type WithConfig<Params, Config extends DateTimeConfig> = Omit<
    Params,
    RequiredConfigKeys<Config> & keyof Params
> &
    Partial<Pick<Params, RequiredConfigKeys<Config> & keyof Params>>;
