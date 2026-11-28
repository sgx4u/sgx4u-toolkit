import type {
    FrequencyEntry,
    GetFrequenciesParams,
} from "./get-frequencies.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns how often each distinct value appears, in first-seen order.
 *
 * `value` is the item, or the `by` result when `by` is set. `item` is the
 * first occurrence. Keys use SameValueZero. Numbers are not required.
 *
 * An empty array returns `undefined`, not an empty array. A value that is
 * not a params object, or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetFrequenciesParams}.
 * @returns The frequencies, or `undefined` when there is nothing to count.
 * @throws {@link TypeError} When `by` is set and is not an iteratee.
 * @example
 * getFrequencies({ array: ["a", "b", "a"] })
 */
export function getFrequencies<Item>(
    params: GetFrequenciesParams<Item>,
): FrequencyEntry<Item>[] | undefined;
export function getFrequencies(
    input: unknown,
): FrequencyEntry<unknown>[] | undefined;
export function getFrequencies(
    input: unknown,
): FrequencyEntry<unknown>[] | undefined {
    const params = readParams<GetFrequenciesParams<unknown>>(input);
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
    if (array.length === 0) {
        return undefined;
    }
    return countValues(array, params.by);
}

/**
 * @param array - A non-empty array.
 * @param by - An optional iteratee. Already checked when present.
 * @returns First-seen frequencies.
 */
function countValues(
    array: readonly unknown[],
    by: Iteratee<unknown> | undefined,
): FrequencyEntry<unknown>[] {
    const read = by === undefined ? undefined : resolveIteratee(by);
    const entries: FrequencyEntry<unknown>[] = [];
    const indexByKey = new Map<unknown, number>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        const value = read === undefined ? item : read(item, index, array);
        const existing = indexByKey.get(value);
        if (existing === undefined) {
            indexByKey.set(value, entries.length);
            entries.push({ value, item, count: 1 });
            continue;
        }
        const entry = entries[existing] as FrequencyEntry<unknown>;
        entry.count += 1;
    }
    return entries;
}
