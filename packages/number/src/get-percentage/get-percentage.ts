import {
    divideDecimal,
    multiplyDecimal,
} from "../utils/decimal-arithmetic.utils.js";

/**
 * Returns `100 * part / whole`, so a quarter of a whole is `25`. A whole of zero returns `undefined`.
 *
 * @example
 * getPercentage({ part: 1, whole: 4 });
 */
export function getPercentage(parameters: {
    part: number;
    whole: number;
}): number | undefined {
    if (
        !Number.isFinite(parameters.part) ||
        !Number.isFinite(parameters.whole) ||
        parameters.whole === 0
    ) {
        return undefined;
    }
    const scaled = multiplyDecimal(parameters.part, 100);
    if (scaled === undefined) {
        return undefined;
    }
    return divideDecimal(scaled, parameters.whole);
}
