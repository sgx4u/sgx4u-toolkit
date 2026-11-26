import type { LocaleOptions } from "../types/options.types.js";

/**
 * Fields for {@link getLocaleDatePattern}.
 */
export interface GetLocaleDatePatternParams extends LocaleOptions {
    /**
     * The `Intl` date style used to discover the pattern.
     *
     * @defaultValue `"short"`
     */
    style?: "short" | "medium";
}
