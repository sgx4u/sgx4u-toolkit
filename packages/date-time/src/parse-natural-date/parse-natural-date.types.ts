import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * How an English date phrase is resolved.
 */
export interface ParseNaturalDateOptions extends NowOptions, TimeZoneOptions {
    /**
     * A month and day with no year resolve to the next occurrence.
     * When false, they resolve to the most recent one.
     *
     * @defaultValue `true`
     */
    preferFuture?: boolean;
}
