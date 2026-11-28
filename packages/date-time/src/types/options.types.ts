import type { DateInput } from "./date-input.types.js";
import type { Weekday } from "./time.types.js";

/**
 * How to choose an instant when a wall-clock time is skipped or repeated.
 *
 * `"compatible"` moves a skipped time forward by the gap and keeps the
 * earlier instant of a repeated time. `"earlier"` and `"later"` pick that
 * side for both cases. `"reject"` throws.
 */
export type Disambiguation = "compatible" | "earlier" | "later" | "reject";

/**
 * What to do when a calendar day does not exist in the target month.
 */
export type Overflow = "constrain" | "reject";

/**
 * Time zone used to read or build wall-clock fields.
 */
export interface TimeZoneOptions {
    /**
     * An IANA time zone name, `"UTC"`, or a fixed offset
     * (`+05:30`, `+0530`, or `+05`).
     *
     * @defaultValue The system time zone, read on each call.
     */
    timeZone?: string;
}

/**
 * How a skipped or repeated wall-clock time becomes an instant.
 */
export interface DisambiguationOptions {
    /**
     * Which instant to use at a daylight-saving gap or overlap.
     *
     * @defaultValue `"compatible"`
     */
    disambiguation?: Disambiguation;
}

/**
 * Locale used for names and patterns that come from `Intl`.
 */
export interface LocaleOptions {
    /**
     * A BCP 47 language tag, or a list of tags in preference order.
     *
     * @defaultValue The runtime's default locale.
     */
    locale?: string | readonly string[];
}

/**
 * Which weekday starts a week.
 */
export interface WeekOptions {
    /**
     * ISO weekday number that starts the week. `1` is Monday.
     *
     * @defaultValue `1`
     */
    weekStartsOn?: Weekday;
}

/**
 * The instant treated as the current time.
 */
export interface NowOptions {
    /**
     * The instant to use instead of the current time.
     *
     * @defaultValue `Date.now()`, read on each call.
     */
    now?: DateInput;
}

/**
 * Where a fiscal year begins and which year number labels it.
 */
export interface FiscalYearOptions {
    /**
     * Month the fiscal year starts, from `1` through `12`. April is `4`.
     */
    fiscalYearStartMonth: number;
    /**
     * Which calendar year labels the fiscal year.
     *
     * @defaultValue `"end-year"`
     */
    fiscalYearLabel?: "start-year" | "end-year";
}
