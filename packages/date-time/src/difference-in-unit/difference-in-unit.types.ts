import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * How a fractional unit is turned into an integer.
 */
export interface DifferenceInUnitOptions extends TimeZoneOptions {
    /**
     * `"truncate"` moves toward zero. `"round"` at a half moves away from zero.
     *
     * @defaultValue `"truncate"`
     */
    rounding?: "truncate" | "floor" | "ceil" | "round";
}
