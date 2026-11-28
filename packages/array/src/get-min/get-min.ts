import type { GetMinParams } from "./get-min.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";

/**
 * Returns the item that is strictly smallest.
 *
 * Ties keep the earlier item: a candidate replaces the champion only when
 * `candidate < champion`. When `by` is set, that comparison uses the finite
 * numbers `by` returns, and the result is still the item. When `by` is
 * omitted, the items are compared with `<` and non-numbers do not throw.
 *
 * An empty array returns `undefined`. A value that is not an array, and a
 * params object whose `array` is not an array, returns `undefined`.
 *
 * @param input - A bare array, or {@link GetMinParams}.
 * @returns The minimum item, or `undefined` when there is nothing to compare.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when `by` is set and an item's number is not finite.
 * @example
 * getMin([3, 1, 2])
 * @example
 * getMin({ array: [{ n: 3 }, { n: 1 }], by: "n" })
 */
export function getMin<Item>(array: readonly Item[]): Item | undefined;
export function getMin<Item>(params: GetMinParams<Item>): Item | undefined;
export function getMin(input: unknown): unknown;
export function getMin(input: unknown): unknown {
    const params = readArrayParams<GetMinParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined || array.length === 0) {
        return undefined;
    }
    if (params.by === undefined) {
        return minimumItem(array);
    }
    assertIteratee("by", params.by);
    const samples = readFiniteNumbers(array, params.by);
    let champion = samples[0];
    if (champion === undefined) {
        return undefined;
    }
    for (let index = 1; index < samples.length; index += 1) {
        const candidate = samples[index];
        if (candidate !== undefined && candidate.value < champion.value) {
            champion = candidate;
        }
    }
    return champion.item;
}

/**
 * @param array - A non-empty array.
 * @returns The first item that is strictly smallest under `<`.
 */
function minimumItem(array: readonly unknown[]): unknown {
    let champion = array[0] as unknown;
    for (let index = 1; index < array.length; index += 1) {
        const candidate = array[index] as unknown;
        if (isLess(candidate, champion)) {
            champion = candidate;
        }
    }
    return champion;
}

/**
 * @param candidate - The later value.
 * @param champion - The current minimum.
 * @returns `true` when `candidate < champion`.
 */
function isLess(candidate: unknown, champion: unknown): boolean {
    return (candidate as number) < (champion as number);
}
