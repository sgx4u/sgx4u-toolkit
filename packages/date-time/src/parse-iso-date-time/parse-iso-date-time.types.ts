import type { DisambiguationOptions } from "../types/options.types.js";

/**
 * How a date-time without an offset is placed on the timeline.
 */
export interface ParseIsoDateTimeOptions extends DisambiguationOptions {
    /**
     * Zone used when the text has no offset and no bracketed zone.
     *
     * There is no default. Without this option, a date-time with no offset
     * returns `undefined`.
     */
    defaultTimeZone?: string;
}
