import type { DisambiguationOptions } from "../types/options.types.js";

/**
 * Fields for {@link parseISODateTime}.
 */
export interface ParseISODateTimeParams extends DisambiguationOptions {
    /**
     * The candidate text.
     */
    value: string;
    /**
     * Zone used when the text has no offset.
     */
    defaultTimeZone?: string;
}
