import type { Equals } from "../types/equals.types.js";
import type { IsSubsetParams } from "./is-subset.types.js";
import { membershipFrom, sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Reports whether every item of `array` appears in `of`.
 *
 * An empty array is a subset of any array, including an empty one.
 * Multiplicity is ignored: `[1, 1]` is a subset of `[1]`. The function
 * never throws. A non-array, or an `equals` that is not a function, returns
 * `false`.
 *
 * @param params - `array`, `of`, and an optional `equals`.
 * @returns `true` when every item of `array` has a match in `of`.
 * @example
 * isSubset({ array: [1, 1], of: [1, 2] })
 */
export function isSubset<Item>(params: IsSubsetParams<Item>): boolean;
export function isSubset(params: unknown): boolean;
export function isSubset(params: unknown): boolean {
    const resolved = readParams<IsSubsetParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const equals = readEquals<unknown>(resolved.equals);
    const array = readArray<unknown>(resolved.array);
    const of = readArray<unknown>(resolved.of);
    if (equals === undefined || array === undefined || of === undefined) {
        return false;
    }
    const members = membershipFrom(of, equals);
    for (let index = 0; index < array.length; index += 1) {
        if (!members.has(array[index] as unknown)) {
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
