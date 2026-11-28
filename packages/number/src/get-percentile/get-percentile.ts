import type { QuantileMethod } from "../types/quantile-method.types.js";
import { defaultQuantileMethod } from "../constants/number-defaults.constants.js";
import {
    assertPercentile,
    assertQuantileMethod,
    quantileOf,
} from "../utils/quantile.utils.js";

/**
 * Returns a percentile from 0 to 100. The default method is `linear`, Hyndman-Fan type 7. `inclusive` uses the same positions. `exclusive` is type 6.
 *
 * @throws {@link RangeError} When `percentile` is outside 0 to 100 or `method` is unknown.
 *
 * @example
 * getPercentile({ values: [1, 2, 3, 4], percentile: 50 });
 */
export function getPercentile(parameters: {
    values: readonly number[];
    percentile: number;
    method?: QuantileMethod;
}): number | undefined {
    const method = parameters.method ?? defaultQuantileMethod;
    assertPercentile(parameters.percentile);
    assertQuantileMethod(method);
    return quantileOf(parameters.values, parameters.percentile / 100, method);
}
