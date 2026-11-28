import type { QuantileMethod } from "../types/quantile-method.types.js";
import { defaultQuantileMethod } from "../constants/number-defaults.constants.js";
import {
    assertProbability,
    assertQuantileMethod,
    quantileOf,
} from "../utils/quantile.utils.js";

/**
 * Returns a quantile for a probability from 0 to 1. The default method is `linear`.
 *
 * @throws {@link RangeError} When `probability` is outside 0 to 1 or `method` is unknown.
 *
 * @example
 * getQuantile({ values: [1, 2, 3, 4], probability: 0.5 });
 */
export function getQuantile(parameters: {
    values: readonly number[];
    probability: number;
    method?: QuantileMethod;
}): number | undefined {
    const method = parameters.method ?? defaultQuantileMethod;
    assertProbability(parameters.probability);
    assertQuantileMethod(method);
    return quantileOf(parameters.values, parameters.probability, method);
}
