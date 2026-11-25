import type {
    DisambiguationOptions,
    Overflow,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * How calendar addition resolves a missing day and a daylight-saving gap.
 */
export interface AddDurationOptions
    extends TimeZoneOptions, DisambiguationOptions {
    /**
     * What to do when the day does not exist in the target month.
     *
     * @defaultValue `"constrain"`
     */
    overflow?: Overflow;
}
