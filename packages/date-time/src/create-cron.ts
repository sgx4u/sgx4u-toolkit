import { describeCronExpression } from "./describe-cron-expression/describe-cron-expression.js";
import type { DescribeCronExpressionParams } from "./describe-cron-expression/describe-cron-expression.types.js";
import { doesCronMatch } from "./does-cron-match/does-cron-match.js";
import type { DoesCronMatchParams } from "./does-cron-match/does-cron-match.types.js";
import { getNextCronRuns } from "./get-next-cron-runs/get-next-cron-runs.js";
import type { GetNextCronRunsParams } from "./get-next-cron-runs/get-next-cron-runs.types.js";
import { getPreviousCronRuns } from "./get-previous-cron-runs/get-previous-cron-runs.js";
import type { GetPreviousCronRunsParams } from "./get-previous-cron-runs/get-previous-cron-runs.types.js";
import { isValidCronExpression } from "./is-valid-cron-expression/is-valid-cron-expression.js";
import type { IsValidCronExpressionParams } from "./is-valid-cron-expression/is-valid-cron-expression.js";
import { parseCronExpression } from "./parse-cron-expression/parse-cron-expression.js";
import type { ParseCronExpressionParams } from "./parse-cron-expression/parse-cron-expression.types.js";
import type {
    DateTimeConfig,
    WithConfig,
} from "./types/date-time-config.types.js";
import {
    applyDateTimeConfig,
    freezeDateTimeConfig,
} from "./utils/config.utils.js";

/**
 * Cron functions with one config's defaults already applied.
 */
export interface CronInstance<Config extends DateTimeConfig> {
    describeCronExpression(
        params: WithConfig<DescribeCronExpressionParams, Config>,
    ): ReturnType<typeof describeCronExpression>;
    doesCronMatch(
        params: WithConfig<DoesCronMatchParams, Config>,
    ): ReturnType<typeof doesCronMatch>;
    getNextCronRuns(
        params: WithConfig<GetNextCronRunsParams, Config>,
    ): ReturnType<typeof getNextCronRuns>;
    getPreviousCronRuns(
        params: WithConfig<GetPreviousCronRunsParams, Config>,
    ): ReturnType<typeof getPreviousCronRuns>;
    isValidCronExpression(
        params: WithConfig<IsValidCronExpressionParams, Config>,
    ): ReturnType<typeof isValidCronExpression>;
    parseCronExpression(
        params: WithConfig<ParseCronExpressionParams, Config>,
    ): ReturnType<typeof parseCronExpression>;
}

/**
 * Builds cron functions with the same config as `createDateTime`.
 *
 * @param config - Defaults for every call. Omit it to keep the built-in defaults.
 * @returns The cron functions with those defaults applied.
 * @throws {@link TypeError} When a config field has the wrong type.
 * @throws {@link RangeError} When a zone, locale, weekday, or other setting is unusable.
 * @example
 * const cron = createCron({ timeZone: "UTC" });
 * cron.getNextCronRuns({ schedule: "0 9 * * *", now: "2026-11-26T08:00:00Z" });
 */
export function createCron<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): CronInstance<Config> {
    const frozen = freezeDateTimeConfig(config);
    return {
        describeCronExpression(params) {
            return describeCronExpression(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as DescribeCronExpressionParams,
            );
        },
        doesCronMatch(params) {
            return doesCronMatch(
                applyDateTimeConfig(frozen, params) as DoesCronMatchParams,
            );
        },
        getNextCronRuns(params) {
            return getNextCronRuns(
                applyDateTimeConfig(frozen, params) as GetNextCronRunsParams,
            );
        },
        getPreviousCronRuns(params) {
            return getPreviousCronRuns(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as GetPreviousCronRunsParams,
            );
        },
        isValidCronExpression(params) {
            return isValidCronExpression(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as IsValidCronExpressionParams,
            );
        },
        parseCronExpression(params) {
            return parseCronExpression(
                applyDateTimeConfig(
                    frozen,
                    params,
                ) as ParseCronExpressionParams,
            );
        },
    };
}
