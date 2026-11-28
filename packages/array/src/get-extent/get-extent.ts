import type { Extent, GetExtentParams } from "./get-extent.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the first minimum item and the first maximum item.
 *
 * Ties keep the earlier item. When `by` is set, comparison uses the finite
 * numbers `by` returns and the result is still the items. When `by` is
 * omitted, the items are compared with `<` and `>` and non-numbers do not
 * throw.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetExtentParams}.
 * @returns `{ min, max }`, or `undefined` when there is nothing to compare.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when `by` is set and an item's number is not finite.
 * @example
 * getExtent({ array: [2, 1, 3, 1] })
 */
export function getExtent<Item>(
    params: GetExtentParams<Item>,
): Extent<Item> | undefined;
export function getExtent(input: unknown): Extent<unknown> | undefined;
export function getExtent(input: unknown): Extent<unknown> | undefined {
    const params = readParams<GetExtentParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined || array.length === 0) {
        return undefined;
    }
    if (params.by === undefined) {
        return extentOfItems(array);
    }
    assertIteratee("by", params.by);
    const samples = readFiniteNumbers(array, params.by);
    const first = samples[0];
    if (first === undefined) {
        return undefined;
    }
    let minimum = first;
    let maximum = first;
    for (let index = 1; index < samples.length; index += 1) {
        const candidate = samples[index];
        if (candidate === undefined) {
            continue;
        }
        if (candidate.value < minimum.value) {
            minimum = candidate;
        }
        if (candidate.value > maximum.value) {
            maximum = candidate;
        }
    }
    return { min: minimum.item, max: maximum.item };
}

/**
 * @param array - A non-empty array.
 * @returns The first minimum and the first maximum under `<` and `>`.
 */
function extentOfItems(array: readonly unknown[]): Extent<unknown> {
    let minimum = array[0] as unknown;
    let maximum = minimum;
    for (let index = 1; index < array.length; index += 1) {
        const candidate = array[index] as unknown;
        if (isLess(candidate, minimum)) {
            minimum = candidate;
        }
        if (isGreater(candidate, maximum)) {
            maximum = candidate;
        }
    }
    return { min: minimum, max: maximum };
}

/**
 * @param candidate - The later value.
 * @param champion - The current minimum.
 * @returns `true` when `candidate < champion`.
 */
function isLess(candidate: unknown, champion: unknown): boolean {
    return (candidate as number) < (champion as number);
}

/**
 * @param candidate - The later value.
 * @param champion - The current maximum.
 * @returns `true` when `candidate > champion`.
 */
function isGreater(candidate: unknown, champion: unknown): boolean {
    return (candidate as number) > (champion as number);
}
