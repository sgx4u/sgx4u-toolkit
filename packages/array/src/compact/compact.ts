import type { Falsy } from "./compact.types.js";
import { readItem } from "../utils/array.utils.js";
import { readArray } from "../utils/params.utils.js";

/**
 * Returns a new array without the usual empty values.
 *
 * `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN` are
 * removed. `-0` is removed because `-0 === 0`. A hole is `undefined` and
 * is removed. `true`, non-zero numbers, non-empty strings, bigints other
 * than `0n`, and objects are kept. The input is not mutated. A non-array
 * returns `undefined`. The result is a new array.
 *
 * @param array - The array to copy from. A non-array returns `undefined`.
 * @returns The kept items, or `undefined` when `array` is not an array.
 * @example
 * compact([0, 1, "", "a", null]);
 */
export function compact<Item>(
    array: readonly Item[],
): Array<Exclude<Item, Falsy>> | undefined;
/**
 * @param array - A value that is not an array.
 * @returns `undefined` when `array` is not an array.
 */
export function compact(
    array:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function compact(
    array: unknown,
): Array<Exclude<unknown, Falsy>> | undefined {
    const items = readArray(array);
    if (items === undefined) {
        return undefined;
    }
    const result: Array<Exclude<unknown, Falsy>> = [];
    for (let index = 0; index < items.length; index += 1) {
        const item = readItem(items, index);
        if (!isRemovedByCompact(item)) {
            result.push(item as Exclude<unknown, Falsy>);
        }
    }
    return result;
}

/**
 * Whether `compact` drops `item`.
 *
 * `NaN` is dropped even though it is not part of {@link Falsy}. `-0`
 * compares equal to `0`, so the `=== 0` check drops it.
 *
 * @param item - One array element, with a hole already read as `undefined`.
 * @returns `true` when `item` is empty.
 */
function isRemovedByCompact(item: unknown): boolean {
    return (
        item === false ||
        item === 0 ||
        item === 0n ||
        item === "" ||
        item === null ||
        item === undefined ||
        (typeof item === "number" && Number.isNaN(item))
    );
}
