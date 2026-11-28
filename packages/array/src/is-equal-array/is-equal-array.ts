import type { Equals } from "../types/equals.types.js";
import type { IsEqualArrayParams } from "./is-equal-array.types.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Reports whether two arrays have the same length and the same items in order.
 *
 * A hole is equal to `undefined`. `NaN` equals `NaN` by default, and `-0`
 * equals `0`. A different order is not equal. The function never throws. A
 * non-array, or an `equals` that is not a function, returns `false`.
 *
 * @param params - `first`, `second`, and an optional `equals`.
 * @returns `true` when the arrays match index by index.
 * @example
 * isEqualArray({ first: [1, Number.NaN], second: [1, Number.NaN] })
 */
export function isEqualArray<Item>(params: IsEqualArrayParams<Item>): boolean;
export function isEqualArray(params: unknown): boolean;
export function isEqualArray(params: unknown): boolean {
    const resolved = readParams<IsEqualArrayParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const equals = readEquals<unknown>(resolved.equals);
    const first = readArray<unknown>(resolved.first);
    const second = readArray<unknown>(resolved.second);
    if (equals === undefined || first === undefined || second === undefined) {
        return false;
    }
    if (first.length !== second.length) {
        return false;
    }
    for (let index = 0; index < first.length; index += 1) {
        if (!equals(first[index] as unknown, second[index] as unknown)) {
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
