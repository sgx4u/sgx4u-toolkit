import { mean } from "../mean/mean.js";
import { sumPrecise } from "../sum-precise/sum-precise.js";

/**
 * Returns the variance. `sample` defaults to `true` and divides by `n - 1`. A sample with fewer than two values returns `undefined`. Population variance needs at least one value.
 *
 * @example
 * getVariance({ values: [1, 2, 3] });
 */
export function getVariance(parameters: {
    values: readonly number[];
    sample?: boolean;
}): number | undefined {
    const sample = parameters.sample ?? true;
    const values = parameters.values;
    if (values.length === 0 || (sample && values.length < 2)) {
        return undefined;
    }
    const average = mean(values);
    if (average === undefined) {
        return undefined;
    }
    const squares = values.map((value) => (value - average) ** 2);
    const total = sumPrecise(squares);
    if (total === undefined) {
        return undefined;
    }
    return total / (sample ? values.length - 1 : values.length);
}
