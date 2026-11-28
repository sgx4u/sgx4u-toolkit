import type { Equals } from "../types/equals.types.js";
import type { CountOccurrencesParams } from "./count-occurrences.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Counts items equal to `value`.
 *
 * The default comparison is SameValueZero, so `NaN` equals `NaN` and `-0`
 * equals `0`. A custom `equals` replaces that. The input is not mutated.
 * Holes are read as `undefined`.
 *
 * @param params - `array`, `value`, and an optional `equals`.
 * @returns The count, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * countOccurrences({ array: [1, 2, 1], value: 1 })
 */
export function countOccurrences<Item>(
    params: CountOccurrencesParams<Item>,
): number | undefined;
export function countOccurrences(params: unknown): number | undefined;
export function countOccurrences(params: unknown): number | undefined {
    const resolved = readParams<CountOccurrencesParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const equals = resolveEquals(
        resolved.equals as Equals<unknown> | undefined,
    );
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return countMatches(array, resolved.value, equals);
}

/**
 * Counts items that match `value`.
 *
 * @param array - The source array.
 * @param value - The searched value.
 * @param equals - The comparer.
 * @returns How many items matched.
 */
function countMatches<Item>(
    array: readonly Item[],
    value: Item,
    equals: Equals<Item>,
): number {
    let count = 0;
    for (let index = 0; index < array.length; index += 1) {
        if (equals(array[index] as Item, value)) {
            count += 1;
        }
    }
    return count;
}
