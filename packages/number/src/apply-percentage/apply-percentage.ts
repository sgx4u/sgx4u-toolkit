import {
    divideDecimal,
    multiplyDecimal,
} from "../utils/decimal-arithmetic.utils.js";

/**
 * Returns `value * (percent / 100)`.
 *
 * @example
 * applyPercentage({ value: 200, percent: 10 });
 */
export function applyPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined {
    if (
        !Number.isFinite(parameters.value) ||
        !Number.isFinite(parameters.percent)
    ) {
        return undefined;
    }
    const ratio = divideDecimal(parameters.percent, 100);
    if (ratio === undefined) {
        return undefined;
    }
    return multiplyDecimal(parameters.value, ratio);
}
