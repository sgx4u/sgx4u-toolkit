import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link parseNaturalDate}.
 */
export interface ParseNaturalDateParams extends NowOptions, TimeZoneOptions {
    /**
     * The English phrase.
     */
    text: string;
    /**
     * A month and day with no year resolve to the next occurrence.
     * When false, they resolve to the most recent one.
     *
     * @defaultValue `true`
     */
    preferFuture?: boolean;
}
