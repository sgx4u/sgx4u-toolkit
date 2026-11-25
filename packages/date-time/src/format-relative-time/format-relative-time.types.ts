import type { LocaleOptions } from "../types/options.types.js";
import type { RelativeTimeOptions } from "../get-relative-time-parts/get-relative-time-parts.types.js";

/**
 * How relative time is written.
 */
export interface FormatRelativeTimeOptions
    extends RelativeTimeOptions, LocaleOptions {
    /**
     * The length of the unit name.
     *
     * @defaultValue `"long"`
     */
    style?: "long" | "short" | "narrow";
    /**
     * `"auto"` allows words such as "yesterday". `"always"` always uses a number.
     *
     * @defaultValue `"auto"`
     */
    numeric?: "always" | "auto";
}
