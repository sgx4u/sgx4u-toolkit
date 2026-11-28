import { valuesAreShallowEqual } from "../utils/equal.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { IsShallowEqualParams } from "./is-shallow-equal.types.js";

/**
 * Reports whether two values match one level deep.
 *
 * Calls `valuesAreShallowEqual`. Nested objects are compared by reference.
 * The function does not throw.
 *
 * @param params - The two values and the symbol-key flag.
 * @returns `true` when the values match. A non-object argument returns `false`.
 * @example
 * isShallowEqual({ first: { a: 1 }, second: { a: 1 } });
 */
export function isShallowEqual(params: IsShallowEqualParams): boolean {
    if (!isObjectLikeValue(params)) {
        return false;
    }
    return valuesAreShallowEqual(
        params.first,
        params.second,
        params.includeSymbols === true,
    );
}
