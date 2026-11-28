import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { FindDuplicateItemsParams } from "./find-duplicate-items.types.js";
import { resolveEquals, sameValueZero } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * One way to decide that two items are the same.
 */
type ItemComparison<Item> =
    | {
          kind: "key";
          read: (item: Item, index: number, array: readonly Item[]) => unknown;
      }
    | { kind: "equals"; equals: Equals<Item> };

/**
 * One first-seen item and how many times it occurs.
 */
interface ItemCount<Item> {
    item: Item;
    count: number;
}

/**
 * Returns the first occurrence of each value that appears more than once.
 *
 * `[1, 2, 1, 3, 2]` returns `[1, 2]`. The order is the order of those first
 * occurrences. `by` wins over `equals` and compares keys with SameValueZero.
 * The stored value is the original item.
 *
 * @param params - `array`, and optional `by` or `equals`.
 * @returns The first copy of each duplicate, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * findDuplicateItems({ array: [1, 2, 1, 3, 2] })
 */
export function findDuplicateItems<Item>(
    params: FindDuplicateItemsParams<Item>,
): Item[] | undefined;
export function findDuplicateItems(params: unknown): unknown[] | undefined;
export function findDuplicateItems(params: unknown): unknown[] | undefined {
    const resolved = readParams<FindDuplicateItemsParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const groups =
        comparison.kind === "key"
            ? groupsByKey(array, comparison.read)
            : groupsByEquals(array, comparison.equals);
    const result: unknown[] = [];
    for (const group of groups) {
        if (group.count > 1) {
            result.push(group.item);
        }
    }
    return result;
}

/**
 * Resolves `by` or `equals`. `by` wins.
 *
 * @param by - An optional iteratee.
 * @param equals - An optional comparer, used only when `by` is omitted.
 * @returns The comparison to use.
 * @throws {@link TypeError} When the selected option has the wrong type.
 */
function readComparison<Item>(
    by: unknown,
    equals: unknown,
): ItemComparison<Item> {
    if (by !== undefined) {
        assertIteratee("by", by);
        return { kind: "key", read: resolveIteratee(by as Iteratee<Item>) };
    }
    return {
        kind: "equals",
        equals: resolveEquals(equals as Equals<Item> | undefined),
    };
}

/**
 * @param array - The source array.
 * @param read - Key reader.
 * @returns First-seen items and their counts.
 */
function groupsByKey<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): ItemCount<Item>[] {
    const groups: ItemCount<Item>[] = [];
    const indexes = new Map<unknown, number>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = read(item, index, array);
        const groupIndex = indexes.get(key);
        if (groupIndex === undefined) {
            indexes.set(key, groups.length);
            groups.push({ item, count: 1 });
            continue;
        }
        const group = groups[groupIndex] as ItemCount<Item>;
        group.count += 1;
    }
    return groups;
}

/**
 * @param array - The source array.
 * @param equals - Item equality.
 * @returns First-seen items and their counts.
 */
function groupsByEquals<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
): ItemCount<Item>[] {
    if (equals === (sameValueZero as Equals<Item>)) {
        return groupsByKey(array, (item) => item);
    }
    const groups: ItemCount<Item>[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const group = groups.find((candidate) => equals(candidate.item, item));
        if (group === undefined) {
            groups.push({ item, count: 1 });
            continue;
        }
        group.count += 1;
    }
    return groups;
}
