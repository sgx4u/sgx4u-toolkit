import type { LocaleOptions } from "../types/options.types.js";

/**
 * How month names are requested.
 */
export interface MonthNameOptions extends LocaleOptions {
    /**
     * The name length.
     *
     * @defaultValue `"long"`
     */
    width?: "long" | "short" | "narrow";
    /**
     * `"format"` is the name used inside a date. `"standalone"` is the name alone.
     *
     * @defaultValue `"standalone"`
     */
    context?: "format" | "standalone";
}
