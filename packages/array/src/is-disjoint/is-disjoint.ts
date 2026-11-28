import type { Equals } from "../types/equals.types.js";
import type { IsDisjointParams } from "./is-disjoint.types.js";
import { membershipFrom, sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Reports whether two arrays share no item.
 *
 * Empty arrays are disjoint. The function never throws. A non-array, or an
 * `equals` that is not a function, returns `false`. `NaN` matches `NaN` by
 * default, so `[NaN]` and `[NaN]` are not disjoint.
 *
 * @param params - `first`, `second`, and an optional `equals`.
 * @returns `true` when no item of `first` matches an item of `second`.
 * @example
 * isDisjoint({ first: [1, 2], second: [3, 4] })
 */
export function isDisjoint<Item>(params: IsDisjointParams<Item>): boolean;
export function isDisjoint(params: unknown): boolean;
export function isDisjoint(params: unknown): boolean {
    const resolved = readParams<IsDisjointParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const equals = readEquals<unknown>(resolved.equals);
    const first = readArray<unknown>(resolved.first);
    const second = readArray<unknown>(resolved.second);
    if (equals === undefined || first === undefined || second === undefined) {
        return false;
    }
    const members = membershipFrom(second, equals);
    for (let index = 0; index < first.length; index += 1) {
        if (members.has(first[index] as unknown)) {
            return false;
        }
    }
    return true;
}

/**
 * Reads `equals` without throwing.
 *
 * @param equals - The candidate comparer.
 * @returns The comparer, or `undefined` when it is not a function.
 */
function readEquals<Item>(equals: unknown): Equals<Item> | undefined {
    if (equals === undefined) {
        return sameValueZero as Equals<Item>;
    }
    if (typeof equals !== "function") {
        return undefined;
    }
    return equals as Equals<Item>;
}
