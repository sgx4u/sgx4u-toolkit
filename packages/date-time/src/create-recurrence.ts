import { describeRecurrenceRule } from "./describe-recurrence-rule/describe-recurrence-rule.js";
import { formatRecurrenceRule } from "./format-recurrence-rule/format-recurrence-rule.js";
import type { GetNextRecurrenceOccurrenceParams } from "./get-next-recurrence-occurrence/get-next-recurrence-occurrence.types.js";
import { getNextRecurrenceOccurrence } from "./get-next-recurrence-occurrence/get-next-recurrence-occurrence.js";
import { getPreviousRecurrenceOccurrence } from "./get-previous-recurrence-occurrence/get-previous-recurrence-occurrence.js";
import { isValidRecurrenceRule } from "./is-valid-recurrence-rule/is-valid-recurrence-rule.js";
import type { ListRecurrenceOccurrencesParams } from "./list-recurrence-occurrences/list-recurrence-occurrences.types.js";
import { listRecurrenceOccurrences } from "./list-recurrence-occurrences/list-recurrence-occurrences.js";
import { parseRecurrenceRule } from "./parse-recurrence-rule/parse-recurrence-rule.js";
import type {
    DateTimeConfig,
    WithConfig,
} from "./types/date-time-config.types.js";
import {
    applyDateTimeConfig,
    freezeDateTimeConfig,
} from "./utils/config.utils.js";

/**
 * Recurrence functions with one config's defaults already applied.
 */
export interface RecurrenceInstance<Config extends DateTimeConfig> {
    describeRecurrenceRule: typeof describeRecurrenceRule;
    formatRecurrenceRule: typeof formatRecurrenceRule;
    isValidRecurrenceRule: typeof isValidRecurrenceRule;
    parseRecurrenceRule: typeof parseRecurrenceRule;
    getNextRecurrenceOccurrence(
        params: WithConfig<GetNextRecurrenceOccurrenceParams, Config>,
    ): ReturnType<typeof getNextRecurrenceOccurrence>;
    getPreviousRecurrenceOccurrence(
        params: WithConfig<GetNextRecurrenceOccurrenceParams, Config>,
    ): ReturnType<typeof getPreviousRecurrenceOccurrence>;
    listRecurrenceOccurrences(
        params: WithConfig<ListRecurrenceOccurrencesParams, Config>,
    ): ReturnType<typeof listRecurrenceOccurrences>;
}

/**
 * Builds recurrence functions with the same config as `createDateTime`.
 *
 * @param config - Defaults for every call. Omit it to keep the built-in defaults.
 * @returns The recurrence functions with those defaults applied.
 * @throws {@link TypeError} When a config field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 * @example
 * const recurrence = createRecurrence({ timeZone: "UTC" });
 */
export function createRecurrence<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): RecurrenceInstance<Config> {
    const frozen = freezeDateTimeConfig(config);
    return {
        describeRecurrenceRule,
        formatRecurrenceRule,
        isValidRecurrenceRule,
        parseRecurrenceRule,
        getNextRecurrenceOccurrence(params) {
            return getNextRecurrenceOccurrence(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as GetNextRecurrenceOccurrenceParams,
            );
        },
        getPreviousRecurrenceOccurrence(params) {
            return getPreviousRecurrenceOccurrence(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as GetNextRecurrenceOccurrenceParams,
            );
        },
        listRecurrenceOccurrences(params) {
            return listRecurrenceOccurrences(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as ListRecurrenceOccurrencesParams,
            );
        },
    };
}
