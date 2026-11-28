import type { Quartiles } from "../types/quartiles.types.js";
import { getPercentile } from "../get-percentile/get-percentile.js";

/**
 * Returns the 25%, 50%, and 75% points using the linear quantile method.
 *
 * @example
 * getQuartiles([1, 2, 3, 4, 5]);
 */
export function getQuartiles(values: readonly number[]): Quartiles | undefined {
    const lower = getPercentile({ values, percentile: 25 });
    const median = getPercentile({ values, percentile: 50 });
    const upper = getPercentile({ values, percentile: 75 });
    if (lower === undefined || median === undefined || upper === undefined) {
        return undefined;
    }
    return { lower, median, upper };
}
