import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Which hemisphere and which season definition to use.
 */
export interface GetSeasonOptions extends TimeZoneOptions {
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
