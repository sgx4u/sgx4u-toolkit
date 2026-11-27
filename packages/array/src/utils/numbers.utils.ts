import type { Iteratee } from "../types/iteratee.types.js";
import { typeError } from "./errors.utils.js";
import { assertIteratee, resolveIteratee } from "./iteratee.utils.js";

/**
 * One finite number and the item it came from.
 */
export interface NumericSample<Item> {
    item: Item;
    value: number;
}

/**
 * Reads a finite number from each item.
 *
 * When `by` is omitted, the item itself must be a finite number. When `by`
 * is set, its result must be a finite number.
 *
 * @param array - The source array.
 * @param by - An optional iteratee.
 * @param functionName - Used when the message should name the function. The argument name stays `by` or `items`.
 * @returns The numbers, in order.
 * @throws {@link TypeError} When a value is not a finite number, or `by` is not an iteratee.
 */
export function readFiniteNumbers<Item>(
    array: readonly Item[],
    by: Iteratee<Item, number> | undefined,
): NumericSample<Item>[] {
    const samples: NumericSample<Item>[] = [];
    if (by === undefined) {
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            if (typeof item !== "number" || !Number.isFinite(item)) {
                throw typeError(
                    "items",
                    "finite numbers when `by` is omitted",
                    item,
                );
            }
            samples.push({ item, value: item });
        }
        return samples;
    }
    assertIteratee("by", by);
    const read = resolveIteratee(by);
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const value = read(item, index, array);
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw typeError(
                "by",
                "a function or key that returns a finite number",
                value,
            );
        }
        samples.push({ item, value });
    }
    return samples;
}
