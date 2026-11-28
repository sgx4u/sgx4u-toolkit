import type { GetModeParams } from "./get-mode.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns every item whose frequency is maximal, in first-seen order.
 *
 * Comparison is SameValueZero. When every item appears once, every item is
 * a mode. When `by` is set, frequency is of the key and each mode is the
 * first item of that key. Numbers are not required.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetModeParams}.
 * @returns The modal items, or `undefined` when there is nothing to count.
 * @throws {@link TypeError} When `by` is set and is not an iteratee.
 * @example
 * getMode({ array: ["a", "b", "a"] })
 */
export function getMode<Item>(params: GetModeParams<Item>): Item[] | undefined;
export function getMode(input: unknown): unknown[] | undefined;
export function getMode(input: unknown): unknown[] | undefined {
    const params = readParams<GetModeParams<unknown>>(input);
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
    const groups = groupItems(array, params.by);
    let highest = 0;
    for (const group of groups) {
        if (group.count > highest) {
            highest = group.count;
        }
    }
    const modes: unknown[] = [];
    for (const group of groups) {
        if (group.count === highest) {
            modes.push(group.item);
        }
    }
    return modes;
}

interface FrequencyGroup {
    item: unknown;
    count: number;
}

/**
 * @param array - The source array.
 * @param by - An optional iteratee. Already checked when present.
 * @returns First-seen groups and their counts.
 */
function groupItems(
    array: readonly unknown[],
    by: Iteratee<unknown> | undefined,
): FrequencyGroup[] {
    const read = by === undefined ? undefined : resolveIteratee(by);
    const groups: FrequencyGroup[] = [];
    const indexByKey = new Map<unknown, number>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        const key = read === undefined ? item : read(item, index, array);
        const existing = indexByKey.get(key);
        if (existing === undefined) {
            indexByKey.set(key, groups.length);
            groups.push({ item, count: 1 });
            continue;
        }
        const group = groups[existing] as FrequencyGroup;
        group.count += 1;
    }
    return groups;
}
