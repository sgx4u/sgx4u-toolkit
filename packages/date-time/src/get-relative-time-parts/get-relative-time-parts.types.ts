import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link getRelativeTimeParts}.
 */
export interface GetRelativeTimePartsParams extends NowOptions {
    /**
     * The date to describe.
     */
    date: DateInput;
    /**
     * `"auto"` picks the unit from the elapsed time. Weeks are never chosen automatically.
     *
     * @defaultValue `"auto"`
     */
    unit?: TimeUnit | "auto";
}
