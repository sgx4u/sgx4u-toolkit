import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link findDatesInText}.
 */
export interface FindDatesInTextParams extends NowOptions, TimeZoneOptions {
    /**
     * The text to scan.
     */
    text: string;
    /**
     * When `true`, month-day phrases without a year choose the next date.
     *
     * @defaultValue `true`
     */
    preferFuture?: boolean;
}
