import type { GetBestItemParams } from "./get-best-item.types.js";
import { assertFunction } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the item that wins a left-to-right comparison.
 *
 * The first item is the champion. Each later item replaces it when
 * `isBetter(candidate, champion)` is true. An empty array returns
 * `undefined`. A value that is not a params object, or whose `array` is not
 * an array, returns `undefined`.
 *
 * @param input - {@link GetBestItemParams}.
 * @returns The winning item, or `undefined` when there is nothing to compare.
 * @throws {@link TypeError} When `isBetter` is not a function.
 * @example
 * getBestItem({
 *   array: ["aa", "b", "ccc"],
 *   isBetter: (candidate, champion) => candidate.length > champion.length,
 * })
 */
export function getBestItem<Item>(
    params: GetBestItemParams<Item>,
): Item | undefined;
export function getBestItem(input: unknown): unknown;
export function getBestItem(input: unknown): unknown {
    const params = readParams<GetBestItemParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    assertFunction("isBetter", params.isBetter);
    if (array.length === 0) {
        return undefined;
    }
    const isBetter = params.isBetter as (
        candidate: unknown,
        champion: unknown,
    ) => boolean;
    let champion = array[0] as unknown;
    for (let index = 1; index < array.length; index += 1) {
        const candidate = array[index] as unknown;
        if (isBetter(candidate, champion)) {
            champion = candidate;
        }
    }
    return champion;
}
