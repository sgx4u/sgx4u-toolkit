import { subtractDecimal } from "../utils/decimal-arithmetic.utils.js";
import { applyPercentage } from "../apply-percentage/apply-percentage.js";

/**
 * Subtracts a percentage of `value` from `value`.
 *
 * @example
 * decreaseByPercentage({ value: 200, percent: 10 });
 */
export function decreaseByPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined {
    const delta = applyPercentage(parameters);
    if (delta === undefined) {
        return undefined;
    }
    return subtractDecimal(parameters.value, delta);
}
