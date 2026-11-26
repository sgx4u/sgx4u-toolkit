import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link roundToUnit}.
 */
export interface RoundToUnitParams extends TimeZoneOptions {
    /**
     * The instant to round.
     */
    date: DateInput;
    /**
     * The unit to round to.
     */
    unit: TimeUnit | "decade";
    /**
     * How many units form one step. For minutes, `15` rounds to the quarter hour.
     *
     * @defaultValue `1`
     */
    increment?: number;
    /**
     * Which boundary to choose. `"nearest"` at the halfway point moves later.
     *
     * @defaultValue `"nearest"`
     */
    mode?: "nearest" | "down" | "up";
}