import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * How a duration is rounded.
 */
export interface RoundDurationOptions extends TimeZoneOptions {
    /**
     * The unit the result is rounded to.
     */
    smallestUnit: TimeUnit;
    /**
     * `"nearest"` rounds half away from zero. `"down"` moves toward zero.
     * `"up"` moves away from zero.
     *
     * @defaultValue `"nearest"`
     */
    mode?: "nearest" | "down" | "up";
    /**
     * The instant used when the duration contains months or years, or when
     * `smallestUnit` is a calendar unit.
     */
    relativeTo?: DateInput;
}
