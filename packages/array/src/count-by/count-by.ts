import type { Iteratee } from "../types/iteratee.types.js";
import type { CountByParams } from "./count-by.types.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Counts items by a string key, in first-seen key order.
 *
 * The key is `String(by(item))`. Distinct objects share
 * `"[object Object]"`. A symbol key uses `Symbol.prototype.toString`.
 * `NaN` counts with `NaN` because both stringify to `"NaN"`. `-0` counts
 * with `0` because both stringify to `"0"`.
 *
 * Integer-like keys are enumerated in numeric order by JavaScript. Every
 * other string key stays in first-seen order.
 *
 * @param params - `array` and an iteratee `by`.
 * @returns A record of counts, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not a property key or a function.
 * @example
 * countBy({ array: ["red", "blue", "red"], by: (item) => item })
 */
export function countBy<Item>(
    params: CountByParams<Item>,
): Record<string, number> | undefined;
export function countBy(params: unknown): Record<string, number> | undefined;
export function countBy(params: unknown): Record<string, number> | undefined {
    const resolved = readParams<CountByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertIteratee("by", resolved.by);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const read = resolveIteratee(resolved.by as Iteratee<unknown>);
    return countKeys(array, read);
}

/**
 * Counts stringified keys.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @returns Counts in first-seen order, aside from integer-like keys.
 */
function countKeys<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Record<string, number> {
    const counts = new Map<string, number>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = stringKey(read(item, index, array));
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const result: Record<string, number> = {};
    for (const [key, count] of counts) {
        result[key] = count;
    }
    return result;
}

/**
 * Text used as a record key.
 *
 * @param key - The iteratee result.
 * @returns `String(key)`, or the symbol's own text when `key` is a symbol.
 */
function stringKey(key: unknown): string {
    if (typeof key === "symbol") {
        return key.toString();
    }
    return String(key);
}
