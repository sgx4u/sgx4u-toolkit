import type { NowOptions } from "../types/options.types.js";

/**
 * How the next or previous occurrence is chosen.
 */
export interface AdjacentRecurrenceOptions extends NowOptions {
    /**
     * Whether an occurrence at `now` counts.
     *
     * @defaultValue `false`
     */
    includeNow?: boolean;
}
