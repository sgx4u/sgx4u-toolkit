import { addDecimal } from "../utils/decimal-arithmetic.utils.js";
import { applyPercentage } from "../apply-percentage/apply-percentage.js";

/**
 * Adds a percentage of `value` to `value`.
 *
 * @example
 * increaseByPercentage({ value: 200, percent: 10 });
 */
export function increaseByPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined {
    const delta = applyPercentage(parameters);
    if (delta === undefined) {
        return undefined;
    }
    return addDecimal(parameters.value, delta);
}
