import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions } from "../types/options.types.js";

/**
 * Fields for {@link getCountdownParts}.
 */
export interface GetCountdownPartsParams extends NowOptions {
    /**
     * The instant being counted down to.
     */
    target: DateInput;
    /**
     * Days are 24-hour stretches of elapsed time.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: "day" | "hour" | "minute" | "second";
}