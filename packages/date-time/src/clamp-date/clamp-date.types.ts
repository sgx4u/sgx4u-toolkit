import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link clampDate}.
 */
export interface ClampDateParams {
    /**
     * The date to limit.
     */
    date: DateInput;
    /**
     * Inclusive start of the range.
     */
    start: DateInput;
    /**
     * Inclusive end of the range.
     */
    end: DateInput;
}
