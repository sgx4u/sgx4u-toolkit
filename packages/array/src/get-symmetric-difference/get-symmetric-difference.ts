import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { GetSymmetricDifferenceParams } from "./get-symmetric-difference.types.js";
import { resolveEquals, sameValueZero } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

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
 * One first-seen item and how many arrays contain it.
 */
interface Presence<Item> {
    item: Item;
    count: number;
}

/**
 * Keeps items that occur in an odd number of input arrays.
 *
 * Each array contributes at most one to the count, so duplicates inside one
 * array do not change the result. Order is first-seen across the arrays from
 * left to right. Two arrays are the usual symmetric difference. An empty
 * list returns `[]`. `by` wins over `equals`. The stored value is the first
 * item that produced the key.
 *
 * @param params - `arrays`, and optional `by` or `equals`.
 * @returns The symmetric difference, or `undefined` when `arrays` is not an array of arrays.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * getSymmetricDifference({ arrays: [[1, 2, 2], [2, 3]] })
 */
export function getSymmetricDifference<Item>(
    params: GetSymmetricDifferenceParams<Item>,
): Item[] | undefined;
export function getSymmetricDifference(params: unknown): unknown[] | undefined;
export function getSymmetricDifference(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetSymmetricDifferenceParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    const presences =
        comparison.kind === "key"
            ? presencesByKey(arrays, comparison.read)
            : presencesByEquals(arrays, comparison.equals);
    const result: unknown[] = [];
    for (const presence of presences) {
        if (presence.count % 2 === 1) {
            result.push(presence.item);
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
 * @param arrays - Arrays of items.
 * @param read - Key reader.
 * @returns First-seen items and how many arrays contain each key.
 */
function presencesByKey<Item>(
    arrays: readonly (readonly Item[])[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Presence<Item>[] {
    const presences: Presence<Item>[] = [];
    const indexes = new Map<unknown, number>();
    for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
        const array = arrays[arrayIndex] as readonly Item[];
        const seenHere = new Set<unknown>();
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            const key = read(item, index, array);
            if (seenHere.has(key)) {
                continue;
            }
            seenHere.add(key);
            const groupIndex = indexes.get(key);
            if (groupIndex === undefined) {
                indexes.set(key, presences.length);
                presences.push({ item, count: 1 });
                continue;
            }
            const presence = presences[groupIndex] as Presence<Item>;
            presence.count += 1;
        }
    }
    return presences;
}

/**
 * @param arrays - Arrays of items.
 * @param equals - Item equality.
 * @returns First-seen items and how many arrays contain each item.
 */
function presencesByEquals<Item>(
    arrays: readonly (readonly Item[])[],
    equals: Equals<Item>,
): Presence<Item>[] {
    if (equals === (sameValueZero as Equals<Item>)) {
        return presencesByKey(arrays, (item) => item);
    }
    const presences: Presence<Item>[] = [];
    for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
        const array = arrays[arrayIndex] as readonly Item[];
        const seenHere: Item[] = [];
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            if (seenHere.some((candidate) => equals(candidate, item))) {
                continue;
            }
            seenHere.push(item);
            const presence = presences.find((candidate) =>
                equals(candidate.item, item),
            );
            if (presence === undefined) {
                presences.push({ item, count: 1 });
                continue;
            }
            presence.count += 1;
        }
    }
    return presences;
}
