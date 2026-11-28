import { findDatesInText } from "./find-dates-in-text/find-dates-in-text.js";
import type { FindDatesInTextParams } from "./find-dates-in-text/find-dates-in-text.types.js";
import { parseNaturalDate } from "./parse-natural-date/parse-natural-date.js";
import type { ParseNaturalDateParams } from "./parse-natural-date/parse-natural-date.types.js";
import { parseNaturalDateRange } from "./parse-natural-date-range/parse-natural-date-range.js";
import type { ParseNaturalDateRangeParams } from "./parse-natural-date-range/parse-natural-date-range.js";
import type {
    DateTimeConfig,
    WithConfig,
} from "./types/date-time-config.types.js";
import {
    applyDateTimeConfig,
    freezeDateTimeConfig,
} from "./utils/config.utils.js";

/**
 * English date functions with one config's defaults already applied.
 */
export interface NaturalLanguageInstance<Config extends DateTimeConfig> {
    findDatesInText(
        params: WithConfig<FindDatesInTextParams, Config>,
    ): ReturnType<typeof findDatesInText>;
    parseNaturalDate(
        params: WithConfig<ParseNaturalDateParams, Config>,
    ): ReturnType<typeof parseNaturalDate>;
    parseNaturalDateRange(
        params: WithConfig<ParseNaturalDateRangeParams, Config>,
    ): ReturnType<typeof parseNaturalDateRange>;
}

/**
 * Builds English date functions with the same config as `createDateTime`.
 *
 * @param config - Defaults for every call. Omit it to keep the built-in defaults.
 * @returns The natural-language functions with those defaults applied.
 * @throws {@link TypeError} When a config field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 * @example
 * const english = createNaturalLanguage({ timeZone: "UTC" });
 * english.parseNaturalDate({ text: "tomorrow", now: "2026-11-26T12:00:00Z" });
 */
export function createNaturalLanguage<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): NaturalLanguageInstance<Config> {
    const frozen = freezeDateTimeConfig(config);
    return {
        findDatesInText(params) {
            return findDatesInText(
                applyDateTimeConfig(frozen, params) as FindDatesInTextParams,
            );
        },
        parseNaturalDate(params) {
            return parseNaturalDate(
                applyDateTimeConfig(frozen, params) as ParseNaturalDateParams,
            );
        },
        parseNaturalDateRange(params) {
            return parseNaturalDateRange(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as ParseNaturalDateRangeParams,
            );
        },
    };
}
