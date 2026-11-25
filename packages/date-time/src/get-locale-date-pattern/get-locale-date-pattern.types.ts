import type { LocaleOptions } from "../types/options.types.js";

/**
 * Which numeric date pattern to read.
 */
export interface LocaleDatePatternOptions extends LocaleOptions {
    /**
     * The `Intl` date style used to discover the pattern.
     *
     * @defaultValue `"short"`
     */
    style?: "short" | "medium";
}
