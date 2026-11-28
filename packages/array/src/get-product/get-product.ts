import type { GetProductParams } from "./get-product.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the product of the numbers in the array.
 *
 * An empty array returns `1`. A value that is not a params object, or whose
 * `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetProductParams}.
 * @returns The product, `1` for an empty array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @example
 * getProduct({ array: [2, 3, 4] })
 */
export function getProduct<Item>(
    params: GetProductParams<Item>,
): number | undefined;
export function getProduct(input: unknown): number | undefined;
export function getProduct(input: unknown): number | undefined {
    const params = readParams<GetProductParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    if (params.by !== undefined) {
        assertIteratee("by", params.by);
    }
    const samples = readFiniteNumbers(array, params.by);
    let product = 1;
    for (const sample of samples) {
        product *= sample.value;
    }
    return product;
}
