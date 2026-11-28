import { getStandardDeviation } from "../get-standard-deviation/get-standard-deviation.js";
import { mean as meanOf } from "../mean/mean.js";

/**
 * Returns the z-score from `values`, or from `mean` and `standardDeviation`. A deviation of zero returns `undefined`.
 *
 * @example
 * getZScore({ value: 2, mean: 0, standardDeviation: 1 });
 */
export function getZScore(parameters: {
    value: number;
    values?: readonly number[];
    mean?: number;
    standardDeviation?: number;
    sample?: boolean;
}): number | undefined {
    if (!Number.isFinite(parameters.value)) {
        return undefined;
    }
    let center = parameters.mean;
    let deviation = parameters.standardDeviation;
    if (parameters.values !== undefined) {
        center = meanOf(parameters.values);
        deviation = getStandardDeviation({
            values: parameters.values,
            sample: parameters.sample ?? true,
        });
    }
    if (
        center === undefined ||
        deviation === undefined ||
        deviation === 0 ||
        !Number.isFinite(center) ||
        !Number.isFinite(deviation)
    ) {
        return undefined;
    }
    return (parameters.value - center) / deviation;
}
