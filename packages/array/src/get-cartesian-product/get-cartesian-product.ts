import type { GetCartesianProductParams } from "./get-cartesian-product.types.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

/**
 * Returns every tuple from the cartesian product of the arrays.
 *
 * The last array varies fastest. An empty list of arrays returns `[]`.
 * If any input array is empty, the result is `[]`. A non-array slot, or a
 * list that is not an array, returns `undefined`. Each tuple is a new array.
 * The inputs are not mutated.
 *
 * @param input - {@link GetCartesianProductParams}.
 * @returns The tuples, `[]` when the product is empty, or `undefined` when a slot is not an array.
 * @example
 * getCartesianProduct({ arrays: [[1, 2], ["a", "b"]] })
 */
export function getCartesianProduct<Item>(
    params: GetCartesianProductParams<Item>,
): Item[][] | undefined;
export function getCartesianProduct(input: unknown): unknown[][] | undefined;
export function getCartesianProduct(input: unknown): unknown[][] | undefined {
    const params = readParams<GetCartesianProductParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const arrays = readArrayList(params.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    return cartesian(arrays);
}

/**
 * @param arrays - Arrays that are all arrays.
 * @returns Every tuple. The last array varies fastest.
 */
function cartesian(arrays: readonly (readonly unknown[])[]): unknown[][] {
    if (arrays.length === 0) {
        return [];
    }
    for (const array of arrays) {
        if (array.length === 0) {
            return [];
        }
    }
    let tuples: unknown[][] = [[]];
    for (const array of arrays) {
        const next: unknown[][] = [];
        for (const tuple of tuples) {
            for (let index = 0; index < array.length; index += 1) {
                const expanded = tuple.slice();
                expanded.push(array[index] as unknown);
                next.push(expanded);
            }
        }
        tuples = next;
    }
    return tuples;
}
