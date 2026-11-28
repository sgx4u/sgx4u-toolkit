import type { LocaleOptions } from "../types/options.types.js";
import type { Weekday } from "../types/time.types.js";

/**
 * How weekday names are requested.
 */
export interface WeekdayNameOptions extends LocaleOptions {
    /**
     * The name length.
     *
     * @defaultValue `"long"`
     */
    width?: "long" | "short" | "narrow";
    /**
     * The ISO weekday that comes first.
     *
     * @defaultValue `1`
     */
    startsOn?: Weekday;
}
