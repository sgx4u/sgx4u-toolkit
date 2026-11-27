import type { Equals } from "../types/equals.types.js";
import { typeError } from "./errors.utils.js";

/**
 * SameValueZero equality.
 *
 * `NaN` equals `NaN`. `-0` equals `0`. Objects compare by reference.
 *
 * @param left - The first value.
 * @param right - The second value.
 * @returns `true` when the values match under SameValueZero.
 */
export function sameValueZero(left: unknown, right: unknown): boolean {
    return (
        left === right ||
        (typeof left === "number" &&
            typeof right === "number" &&
            Number.isNaN(left) &&
            Number.isNaN(right))
    );
}

/**
 * Returns the caller's equality function, or SameValueZero.
 *
 * @param equals - An optional comparer.
 * @returns A function that compares two items.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 */
export function resolveEquals<Item>(
    equals: Equals<Item> | undefined,
): Equals<Item> {
    if (equals === undefined) {
        return sameValueZero as Equals<Item>;
    }
    if (typeof equals !== "function") {
        throw typeError("equals", "a function", equals);
    }
    return equals;
}

/**
 * A set of items compared with `equals`.
 *
 * SameValueZero uses a native `Set`. Any other comparer walks a list,
 * because `Set` cannot take a custom equality function.
 */
export interface Membership<Item> {
    /** Whether an equal item was added. */
    has: (item: Item) => boolean;
    /** Records `item` when no equal item is already present. */
    add: (item: Item) => void;
}

/**
 * Builds an empty membership set.
 *
 * @param equals - The comparer. Pass `sameValueZero` to use a native `Set`.
 * @returns An empty set.
 */
export function createMembership<Item>(equals: Equals<Item>): Membership<Item> {
    if (equals === (sameValueZero as Equals<Item>)) {
        const items = new Set<Item>();
        return {
            has: (item: Item) => items.has(item),
            add: (item: Item) => {
                items.add(item);
            },
        };
    }
    const items: Item[] = [];
    return {
        has: (item: Item) => items.some((candidate) => equals(candidate, item)),
        add: (item: Item) => {
            if (!items.some((candidate) => equals(candidate, item))) {
                items.push(item);
            }
        },
    };
}

/**
 * Fills a membership set from `array`.
 *
 * @param array - Items to record.
 * @param equals - The comparer.
 * @returns A set containing the unique items.
 */
export function membershipFrom<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
): Membership<Item> {
    const membership = createMembership(equals);
    for (let index = 0; index < array.length; index += 1) {
        membership.add(array[index] as Item);
    }
    return membership;
}

/**
 * Drops duplicate items, keeping the first or last occurrence.
 *
 * The kept items stay in the order those occurrences appear. SameValueZero
 * uses a `Map`. Any other comparer walks the items seen so far.
 *
 * @param array - The source array. It is not mutated.
 * @param equals - Item equality.
 * @param keep - `"first"` or `"last"`.
 * @returns A new array of the kept items.
 */
export function uniqueInOrder<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
    keep: "first" | "last",
): Item[] {
    if (equals === (sameValueZero as Equals<Item>)) {
        return uniqueSameValueZero(array, keep);
    }
    return uniqueWithEquals(array, equals, keep);
}

/**
 * @param array - The source array.
 * @param keep - Which occurrence to keep.
 * @returns Unique items under SameValueZero.
 */
function uniqueSameValueZero<Item>(
    array: readonly Item[],
    keep: "first" | "last",
): Item[] {
    if (keep === "first") {
        const seen = new Set<Item>();
        const result: Item[] = [];
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            if (seen.has(item)) {
                continue;
            }
            seen.add(item);
            result.push(item);
        }
        return result;
    }
    const lastIndex = new Map<Item, number>();
    for (let index = 0; index < array.length; index += 1) {
        lastIndex.set(array[index] as Item, index);
    }
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (lastIndex.get(array[index] as Item) === index) {
            result.push(array[index] as Item);
        }
    }
    return result;
}

/**
 * @param array - The source array.
 * @param equals - A custom comparer.
 * @param keep - Which occurrence to keep.
 * @returns Unique items under `equals`.
 */
function uniqueWithEquals<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
    keep: "first" | "last",
): Item[] {
    const kept: Item[] = [];
    const indexes: number[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        let groupIndex = -1;
        for (let candidate = 0; candidate < kept.length; candidate += 1) {
            if (equals(kept[candidate] as Item, item)) {
                groupIndex = candidate;
                break;
            }
        }
        if (groupIndex === -1) {
            kept.push(item);
            indexes.push(index);
            continue;
        }
        if (keep === "last") {
            kept[groupIndex] = item;
            indexes[groupIndex] = index;
        }
    }
    if (keep === "first") {
        return kept;
    }
    const ordered = indexes.map((index, groupIndex) => ({
        index,
        item: kept[groupIndex] as Item,
    }));
    ordered.sort((left, right) => left.index - right.index);
    return ordered.map((entry) => entry.item);
}
