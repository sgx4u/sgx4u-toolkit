import { getVariance } from "../get-variance/get-variance.js";

/**
 * Returns the square root of {@link getVariance}.
 *
 * @example
 * getStandardDeviation({ values: [1, 2, 3] });
 */
export function getStandardDeviation(parameters: {
    values: readonly number[];
    sample?: boolean;
}): number | undefined {
    const variance = getVariance(parameters);
    if (variance === undefined) {
        return undefined;
    }
    return Math.sqrt(variance);
}
