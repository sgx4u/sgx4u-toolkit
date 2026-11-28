import { getCombinations } from "../get-combinations/get-combinations.js";
import { readArray } from "../utils/params.utils.js";

/**
 * Returns every unordered pair, in lexicographic index order.
 *
 * This is the combinations of size 2. Fewer than two items returns `[]`.
 * A value that is not an array returns `undefined`. The input is not
 * mutated. Each pair is a new tuple.
 *
 * @param array - The source array.
 * @returns The pairs, `[]` when fewer than two items are present, or `undefined` when `array` is not an array.
 * @example
 * getPairs([1, 2, 3])
 */
export function getPairs<Item>(array: readonly Item[]): Array<[Item, Item]>;
export function getPairs(input: unknown): Array<[unknown, unknown]> | undefined;
export function getPairs(
    input: unknown,
): Array<[unknown, unknown]> | undefined {
    const array = readArray(input);
    if (array === undefined) {
        return undefined;
    }
    const combinations = getCombinations({ array, size: 2 });
    if (combinations === undefined) {
        return undefined;
    }
    const pairs: Array<[unknown, unknown]> = [];
    for (const combination of combinations) {
        pairs.push([combination[0] as unknown, combination[1] as unknown]);
    }
    return pairs;
}
