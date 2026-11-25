import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * How an instant is rounded to a unit step.
 */
export interface RoundToUnitOptions extends TimeZoneOptions {
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
