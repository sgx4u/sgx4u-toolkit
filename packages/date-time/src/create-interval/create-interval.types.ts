import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link createInterval}.
 */
export interface CreateIntervalParams {
    /**
     * The first instant, included.
     */
    start: DateInput;
    /**
     * The instant where the interval stops, excluded.
     */
    end: DateInput;
}
