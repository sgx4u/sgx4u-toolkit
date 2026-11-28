import type { Duration } from "../types/duration.types.js";

/**
 * Fields for {@link addDurations}.
 */
export interface AddDurationsParams {
    /**
     * The first duration.
     */
    first: Duration;
    /**
     * The second duration.
     */
    second: Duration;
}
