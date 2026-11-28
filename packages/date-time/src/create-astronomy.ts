import { getMoonPhase } from "./get-moon-phase/get-moon-phase.js";
import { getSunTimes } from "./get-sun-times/get-sun-times.js";
import type { GetSunTimesParams } from "./get-sun-times/get-sun-times.js";
import type {
    DateTimeConfig,
    WithConfig,
} from "./types/date-time-config.types.js";
import {
    applyDateTimeConfig,
    freezeDateTimeConfig,
} from "./utils/config.utils.js";

/**
 * Astronomy functions with one config's defaults already applied.
 */
export interface AstronomyInstance<Config extends DateTimeConfig> {
    getMoonPhase: typeof getMoonPhase;
    getSunTimes(
        params: WithConfig<GetSunTimesParams, Config>,
    ): ReturnType<typeof getSunTimes>;
}

/**
 * Builds astronomy functions with the same config as `createDateTime`.
 *
 * @param config - Defaults for every call. Omit it to keep the built-in defaults.
 * @returns Sunrise and moon-phase functions with those defaults applied.
 * @throws {@link TypeError} When a config field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 * @example
 * const astronomy = createAstronomy({ timeZone: "UTC" });
 * astronomy.getSunTimes({
 *   date: "2024-03-20",
 *   location: { latitude: 0, longitude: 0 },
 * });
 */
export function createAstronomy<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): AstronomyInstance<Config> {
    const frozen = freezeDateTimeConfig(config);
    return {
        getMoonPhase,
        getSunTimes(params) {
            return getSunTimes(
                applyDateTimeConfig(frozen, params) as GetSunTimesParams,
            );
        },
    };
}
