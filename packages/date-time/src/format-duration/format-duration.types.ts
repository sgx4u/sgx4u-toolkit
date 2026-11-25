import type { LocaleOptions } from "../types/options.types.js";

/**
 * How a duration is written for people.
 */
export interface FormatDurationOptions extends LocaleOptions {
    /**
     * The length of the unit names. `"digital"` is a clock.
     *
     * @defaultValue `"long"`
     */
    style?: "long" | "short" | "narrow" | "digital";
}
