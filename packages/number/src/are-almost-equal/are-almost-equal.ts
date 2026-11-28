import {
    defaultAbsoluteTolerance,
    defaultRelativeTolerance,
} from "../constants/number-defaults.constants.js";

/**
 * Reports whether two finite numbers are within the absolute or relative tolerance. Defaults are `absoluteTolerance` `0` and `relativeTolerance` `Number.EPSILON * 8`.
 *
 * @example
 * areAlmostEqual({ first: 0.1 + 0.2, second: 0.3 });
 */
export function areAlmostEqual(parameters: {
    first: number;
    second: number;
    absoluteTolerance?: number;
    relativeTolerance?: number;
}): boolean {
    const {
        first,
        second,
        absoluteTolerance = defaultAbsoluteTolerance,
        relativeTolerance = defaultRelativeTolerance,
    } = parameters;
    if (!Number.isFinite(first) || !Number.isFinite(second)) {
        return false;
    }
    const difference = Math.abs(first - second);
    const limit = Math.max(
        absoluteTolerance,
        relativeTolerance * Math.max(Math.abs(first), Math.abs(second)),
    );
    return difference <= limit;
}
