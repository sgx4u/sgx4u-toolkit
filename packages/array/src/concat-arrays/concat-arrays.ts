import type { ConcatArraysParams } from "./concat-arrays.types.js";
import { readItem } from "../utils/array.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

/**
 * Concatenates arrays and returns a new array.
 *
 * `skipEmpty` defaults to false. `true` ignores arrays whose length is
 * `0`. A slot that is not an array returns `undefined`. An empty list
 * returns `[]`. The inputs are not mutated. Holes become `undefined`.
 *
 * @param params - The arrays to concatenate.
 * @returns The concatenated items, or `undefined` when `arrays` is not an array of arrays.
 * @example
 * concatArrays({ arrays: [[1], [2, 3]] });
 */
export function concatArrays<Item>(
    params: ConcatArraysParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function concatArrays(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function concatArrays(params: unknown): unknown[] | undefined {
    const resolved = readParams<ConcatArraysParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    return concatenate(arrays, resolved.skipEmpty === true);
}

/**
 * Copies every item, optionally skipping empty arrays.
 *
 * @param arrays - The source arrays.
 * @param skipEmpty - Whether length `0` arrays are ignored.
 * @returns A new dense array.
 */
function concatenate(
    arrays: readonly (readonly unknown[])[],
    skipEmpty: boolean,
): unknown[] {
    const result: unknown[] = [];
    for (const array of arrays) {
        if (skipEmpty && array.length === 0) {
            continue;
        }
        for (let index = 0; index < array.length; index += 1) {
            result.push(readItem(array, index));
        }
    }
    return result;
}
