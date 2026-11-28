import { valuesAreEqual } from "../utils/equal.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { IsEqualParams } from "./is-equal.types.js";

/**
 * Reports whether two values have the same structure.
 *
 * Calls `valuesAreEqual`. `NaN` equals `NaN`, `+0` equals `-0`, and invalid
 * dates are equal. Cycles are always tolerated: `circular` is ignored, and
 * the function does not throw.
 *
 * @param params - The two values and the key filters.
 * @returns `true` when the values match. A non-object argument returns `false`.
 * @example
 * isEqual({ first: { a: Number.NaN }, second: { a: Number.NaN } });
 */
export function isEqual(params: IsEqualParams): boolean {
    if (!isObjectLikeValue(params)) {
        return false;
    }
    return valuesAreEqual(params.first, params.second, {
        includeNonEnumerable: params.includeNonEnumerable === true,
        includeSymbols: params.includeSymbols === true,
    });
}
