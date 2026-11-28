import { getQuartiles } from "../get-quartiles/get-quartiles.js";

/**
 * Returns the distance between the upper and lower quartiles.
 *
 * @example
 * getInterquartileRange([1, 2, 3, 4, 5]);
 */
export function getInterquartileRange(
    values: readonly number[],
): number | undefined {
    const quartiles = getQuartiles(values);
    if (quartiles === undefined) {
        return undefined;
    }
    return quartiles.upper - quartiles.lower;
}
