import type { Equals } from "../types/equals.types.js";
import type { IsSupersetParams } from "./is-superset.types.js";
import { membershipFrom, sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Reports whether `array` contains every item of `of`.
 *
 * An empty `of` is contained by any array, including an empty one.
 * Multiplicity is ignored. The function never throws. A non-array, or an
 * `equals` that is not a function, returns `false`.
 *
 * @param params - `array`, `of`, and an optional `equals`.
 * @returns `true` when every item of `of` has a match in `array`.
 * @example
 * isSuperset({ array: [1, 2, 2], of: [2, 1] })
 */
export function isSuperset<Item>(params: IsSupersetParams<Item>): boolean;
export function isSuperset(params: unknown): boolean;
export function isSuperset(params: unknown): boolean {
    const resolved = readParams<IsSupersetParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const equals = readEquals<unknown>(resolved.equals);
    const array = readArray<unknown>(resolved.array);
    const of = readArray<unknown>(resolved.of);
    if (equals === undefined || array === undefined || of === undefined) {
        return false;
    }
    const members = membershipFrom(array, equals);
    for (let index = 0; index < of.length; index += 1) {
        if (!members.has(of[index] as unknown)) {
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
