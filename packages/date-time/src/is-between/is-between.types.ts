import type { DateInput } from "../types/date-input.types.js";

/**
 * Fields for {@link isBetween}.
 */
export interface IsBetweenParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * One end of the range.
     */
    start: DateInput;
    /**
     * The other end of the range.
     */
    end: DateInput;
    /**
     * Whether the start instant itself counts.
     *
     * @defaultValue `true`
     */
    includeStart?: boolean;
    /**
     * Whether the end instant itself counts.
     *
     * @defaultValue `true`
     */
    includeEnd?: boolean;
}