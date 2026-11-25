import type { NowOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Which unit a relative time uses.
 */
export interface RelativeTimeOptions extends NowOptions {
    /**
     * `"auto"` picks the unit from the elapsed time. Weeks are never chosen automatically.
     *
     * @defaultValue `"auto"`
     */
    unit?: TimeUnit | "auto";
}
