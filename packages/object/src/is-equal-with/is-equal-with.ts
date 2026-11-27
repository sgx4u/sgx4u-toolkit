import { valuesAreEqualWith } from "../utils/equal.utils.js";
import type { EqualVisit } from "../utils/equal.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { IsEqualWithParams } from "./is-equal-with.types.js";

/**
 * Reports whether two values match, with a comparator at each pair.
 *
 * Calls `valuesAreEqualWith`. `undefined` from `comparator` keeps the
 * default rule. Symbol keys are compared only when `includeSymbols` is
 * `true`. Non-enumerable string keys stay out of the comparison.
 *
 * @param params - The two values, the comparator, and the symbol-key flag.
 * @returns `true` when the values match.
 * @throws {TypeError} When `comparator` is not a function.
 * @example
 * isEqualWith({
 *     first: { a: 1 },
 *     second: { a: "1" },
 *     comparator: ({ first, second }) =>
 *         typeof first === "number" && typeof second === "string"
 *             ? first === Number(second)
 *             : undefined,
 * });
 */
export function isEqualWith(params: IsEqualWithParams): boolean {
    const record = isObjectLikeValue(params) ? params : undefined;
    const comparator = readComparator(record?.comparator);
    return valuesAreEqualWith(
        record?.first,
        record?.second,
        {
            includeNonEnumerable: false,
            includeSymbols: record?.includeSymbols === true,
        },
        comparator,
    );
}

/**
 * Requires `comparator` to be a function.
 *
 * @param value - The `comparator` field.
 * @returns The comparator passed to `valuesAreEqualWith`.
 * @throws {TypeError} When `value` is not a function.
 */
function readComparator(
    value: unknown,
): (details: EqualVisit) => boolean | undefined {
    assertFunction(value, "comparator");
    return value as (details: EqualVisit) => boolean | undefined;
}
