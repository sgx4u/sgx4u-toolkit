import { copyArray } from "../utils/array.utils.js";

/**
 * Returns `value` as an array.
 *
 * `null` and `undefined` become an empty array. A real array is copied
 * into a new dense array, so holes become `undefined` and the input is
 * not returned. Every other value, including a string, a typed array, and
 * an iterable, becomes a one-element array. A string is not split into
 * characters. This function does not throw and does not return
 * `undefined`.
 *
 * @param value - An item, an array of items, `null`, or `undefined`.
 * @returns A new array. The input array is not mutated.
 * @example
 * ensureArray("text");
 */
export function ensureArray<Item>(
    value: Item | readonly Item[] | null | undefined,
): Item[] {
    if (value === null || value === undefined) {
        return [];
    }
    if (Array.isArray(value)) {
        return copyArray(value as readonly Item[]);
    }
    return [value as Item];
}
