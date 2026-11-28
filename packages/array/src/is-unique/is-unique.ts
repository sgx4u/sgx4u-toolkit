import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { IsUniqueParams } from "./is-unique.types.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { isIterateeValue, resolveIteratee } from "../utils/iteratee.utils.js";
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
 * Reports whether every item is distinct.
 *
 * An empty array is unique. `by` wins over `equals` and uses SameValueZero
 * on the key. The function never throws. A non-array returns `false`. A
 * non-empty array with an invalid `by`, or with an invalid `equals` when
 * `by` is omitted, returns `false`.
 *
 * @param params - `array`, and optional `by` or `equals`.
 * @returns `true` when no item is repeated.
 * @example
 * isUnique({ array: [1, 2, 3] })
 */
export function isUnique<Item>(params: IsUniqueParams<Item>): boolean;
export function isUnique(params: unknown): boolean;
export function isUnique(params: unknown): boolean {
    const resolved = readParams<IsUniqueParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return false;
    }
    if (array.length === 0) {
        return true;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    if (comparison === undefined) {
        return false;
    }
    if (comparison.kind === "key") {
        return !hasRepeatedKey(array, comparison.read);
    }
    return !hasRepeatedItem(array, comparison.equals);
}

/**
 * Resolves `by` or `equals` without throwing. `by` wins.
 *
 * @param by - An optional iteratee.
 * @param equals - An optional comparer, used only when `by` is omitted.
 * @returns The comparison, or `undefined` when the selected option is invalid.
 */
function readComparison<Item>(
    by: unknown,
    equals: unknown,
): ItemComparison<Item> | undefined {
    if (by !== undefined) {
        if (!isIterateeValue(by)) {
            return undefined;
        }
        return { kind: "key", read: resolveIteratee(by as Iteratee<Item>) };
    }
    if (equals !== undefined && typeof equals !== "function") {
        return undefined;
    }
    const resolved =
        equals === undefined
            ? (sameValueZero as Equals<Item>)
            : (equals as Equals<Item>);
    return { kind: "equals", equals: resolved };
}

/**
 * @param array - The source array.
 * @param read - Key reader.
 * @returns `true` when a key occurs more than once.
 */
function hasRepeatedKey<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): boolean {
    const seen = new Set<unknown>();
    for (let index = 0; index < array.length; index += 1) {
        const key = read(array[index] as Item, index, array);
        if (seen.has(key)) {
            return true;
        }
        seen.add(key);
    }
    return false;
}

/**
 * @param array - The source array.
 * @param equals - Item equality.
 * @returns `true` when an item occurs more than once.
 */
function hasRepeatedItem<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
): boolean {
    if (equals === (sameValueZero as Equals<Item>)) {
        return hasRepeatedKey(array, (item) => item);
    }
    const seen: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        if (seen.some((candidate) => equals(candidate, item))) {
            return true;
        }
        seen.push(item);
    }
    return false;
}
