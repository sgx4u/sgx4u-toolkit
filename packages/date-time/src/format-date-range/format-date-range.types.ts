import type { DateInput } from "../types/date-input.types.js";
import type { FormatDateWithStyleOptions } from "../format-date-with-style/format-date-with-style.types.js";

/**
 * Fields for {@link formatDateRange}.
 */
export interface FormatDateRangeParams extends FormatDateWithStyleOptions {
    /**
     * The first instant.
     */
    start: DateInput;
    /**
     * The second instant. It must not be before `start`.
     */
    end: DateInput;
}
