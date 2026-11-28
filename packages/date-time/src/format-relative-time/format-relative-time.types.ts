import type { DateInput } from "../types/date-input.types.js";
import type { LocaleOptions, NowOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link formatRelativeTime}.
 */
export interface FormatRelativeTimeParams extends NowOptions, LocaleOptions {
    /**
     * The date to describe.
     */
    date: DateInput;
    /**
     * `"auto"` picks the unit from the elapsed time.
     *
     * @defaultValue `"auto"`
     */
    unit?: TimeUnit | "auto";
    /**
     * The length of the unit name.
     *
     * @defaultValue `"long"`
     */
    style?: "long" | "short" | "narrow";
    /**
     * `"auto"` allows words such as "yesterday".
     *
     * @defaultValue `"auto"`
     */
    numeric?: "always" | "auto";
}
