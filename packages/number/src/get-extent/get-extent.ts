import type { NumberExtent } from "../types/number-extent.types.js";
import { getMaximum } from "../get-maximum/get-maximum.js";
import { getMinimum } from "../get-minimum/get-minimum.js";

/**
 * Returns the minimum and maximum of `values`. Any non-finite value, or an empty list, returns `undefined`.
 *
 * @example
 * getExtent([3, 1, 2]);
 */
export function getExtent(values: readonly number[]): NumberExtent | undefined {
    const minimum = getMinimum(values);
    const maximum = getMaximum(values);
    if (minimum === undefined || maximum === undefined) {
        return undefined;
    }
    return { minimum, maximum };
}
