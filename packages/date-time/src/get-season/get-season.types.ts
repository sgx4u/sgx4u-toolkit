import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link getSeason}.
 */
export interface GetSeasonParams extends TimeZoneOptions {
    /**
     * The date to classify.
     */
    date: DateInput;
    /**
     * The southern hemisphere shifts the meteorological seasons by six months.
     *
     * @defaultValue `"northern"`
     */
    hemisphere?: "northern" | "southern";
    /**
     * Meteorological seasons follow calendar months. Astronomical seasons
     * follow the equinoxes and solstices.
     *
     * @defaultValue `"meteorological"`
     */
    method?: "meteorological" | "astronomical";
}
