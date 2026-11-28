import { divideDecimal } from "../utils/decimal-arithmetic.utils.js";
import { sumPrecise } from "../sum-precise/sum-precise.js";

/**
 * Returns the arithmetic mean. An empty list returns `undefined`.
 *
 * @example
 * mean([1, 2, 3]);
 */
export function mean(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    const total = sumPrecise(values);
    if (total === undefined) {
        return undefined;
    }
    return divideDecimal(total, values.length);
}
