import {
    divideDecimal,
    multiplyDecimal,
    subtractDecimal,
} from "../utils/decimal-arithmetic.utils.js";

/**
 * Returns `100 * (to - from) / from`. A `from` of zero returns `undefined`.
 *
 * @example
 * getPercentageChange({ from: 50, to: 75 });
 */
export function getPercentageChange(parameters: {
    from: number;
    to: number;
}): number | undefined {
    if (
        !Number.isFinite(parameters.from) ||
        !Number.isFinite(parameters.to) ||
        parameters.from === 0
    ) {
        return undefined;
    }
    const difference = subtractDecimal(parameters.to, parameters.from);
    if (difference === undefined) {
        return undefined;
    }
    const scaled = multiplyDecimal(difference, 100);
    if (scaled === undefined) {
        return undefined;
    }
    return divideDecimal(scaled, parameters.from);
}
