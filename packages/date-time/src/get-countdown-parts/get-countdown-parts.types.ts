import type { NowOptions } from "../types/options.types.js";

/**
 * The largest unit a countdown balances from.
 */
export interface CountdownOptions extends NowOptions {
    /**
     * Days are 24-hour stretches of elapsed time.
     *
     * @defaultValue `"day"`
     */
    largestUnit?: "day" | "hour" | "minute" | "second";
}
