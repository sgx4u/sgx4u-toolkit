import { matchesSpecification } from "../is-match/is-match.js";
import type { MatchVisit } from "../is-match/is-match.types.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { IsMatchWithParams } from "./is-match-with.types.js";

/**
 * Reports whether `object` matches `specification`, with a comparator.
 *
 * `undefined` from `comparator` keeps the default `isMatch` rule for that
 * step. A boolean decides the step.
 *
 * @param params - The value, the required structure, and the comparator.
 * @returns `true` when `object` satisfies `specification`.
 * @throws {TypeError} When `comparator` is not a function.
 * @example
 * isMatchWith({
 *     object: { a: 2 },
 *     specification: { a: 1 },
 *     comparator: ({ object, specification }) =>
 *         typeof object === "number" && typeof specification === "number"
 *             ? object > specification
 *             : undefined,
 * });
 */
export function isMatchWith(params: IsMatchWithParams): boolean {
    const record = isObjectLikeValue(params) ? params : undefined;
    const comparator = readComparator(record?.comparator);
    return matchesSpecification(
        record?.object,
        record?.specification,
        comparator,
    );
}

/**
 * Requires `comparator` to be a function.
 *
 * @param value - The `comparator` field.
 * @returns The comparator passed through the partial match.
 * @throws {TypeError} When `value` is not a function.
 */
function readComparator(
    value: unknown,
): (details: MatchVisit) => boolean | undefined {
    assertFunction(value, "comparator");
    return value as (details: MatchVisit) => boolean | undefined;
}
