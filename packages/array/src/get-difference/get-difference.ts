import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { GetDifferenceParams } from "./get-difference.types.js";
import { createMembership } from "../utils/equality.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readArrayList, readParams } from "../utils/params.utils.js";

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
 * Keeps unique items from `array` that appear in none of `others`.
 *
 * Order is first-seen in `array`. An empty `others` list returns the unique
 * items of `array`. `by` wins over `equals`. The stored value is the
 * original item from `array`.
 *
 * @param params - `array`, `others`, and optional `by` or `equals`.
 * @returns The difference, or `undefined` when `array` or `others` is not an array of the required shape.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * getDifference({ array: [1, 2, 2, 3], others: [[2], [4]] })
 */
export function getDifference<Item>(
    params: GetDifferenceParams<Item>,
): Item[] | undefined;
export function getDifference(params: unknown): unknown[] | undefined;
export function getDifference(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetDifferenceParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const array = readArray<unknown>(resolved.array);
    const others = readArrayList<unknown>(resolved.others);
    if (array === undefined || others === undefined) {
        return undefined;
    }
    if (comparison.kind === "key") {
        return differenceByKey(array, others, comparison.read);
    }
    return differenceByEquals(array, others, comparison.equals);
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
 * @param array - Items that may be kept.
 * @param others - Arrays of excluded items.
 * @param read - Key reader.
 * @returns Unique items whose keys are absent from `others`.
 */
function differenceByKey<Item>(
    array: readonly Item[],
    others: readonly (readonly Item[])[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Item[] {
    const excluded = new Set<unknown>();
    for (let arrayIndex = 0; arrayIndex < others.length; arrayIndex += 1) {
        const other = others[arrayIndex] as readonly Item[];
        for (let index = 0; index < other.length; index += 1) {
            excluded.add(read(other[index] as Item, index, other));
        }
    }
    const seen = new Set<unknown>();
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = read(item, index, array);
        if (excluded.has(key) || seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(item);
    }
    return result;
}

/**
 * @param array - Items that may be kept.
 * @param others - Arrays of excluded items.
 * @param equals - Item equality.
 * @returns Unique items that match nothing in `others`.
 */
function differenceByEquals<Item>(
    array: readonly Item[],
    others: readonly (readonly Item[])[],
    equals: Equals<Item>,
): Item[] {
    const excluded = createMembership(equals);
    for (let arrayIndex = 0; arrayIndex < others.length; arrayIndex += 1) {
        const other = others[arrayIndex] as readonly Item[];
        for (let index = 0; index < other.length; index += 1) {
            excluded.add(other[index] as Item);
        }
    }
    const seen = createMembership(equals);
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        if (excluded.has(item) || seen.has(item)) {
            continue;
        }
        seen.add(item);
        result.push(item);
    }
    return result;
}
