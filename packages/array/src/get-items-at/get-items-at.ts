import type { GetItemsAtParams } from "./get-items-at.types.js";
import { readItem, resolveIndex } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the items at `indexes`, skipping indexes that cannot be read.
 *
 * A negative index counts from the end. An out-of-range index and a
 * non-integer are skipped rather than throwing. Duplicates are preserved,
 * in the order of `indexes`. A hole is returned as `undefined` and is not
 * skipped. The result is a new array. The input array and `indexes` are
 * not mutated. When the argument is a params object, `indexes` is checked
 * before `array`. A non-object argument returns `undefined`. A non-array
 * `array` returns `undefined`.
 *
 * @param params - `array` and `indexes`.
 * @returns The selected items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `indexes` is not an array.
 * @example
 * getItemsAt({ array: ["a", "b", "c"], indexes: [2, 0, 0] });
 */
export function getItemsAt<Item>(
    params: GetItemsAtParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function getItemsAt(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getItemsAt(params: unknown): unknown[] | undefined {
    const parsed = readParams<GetItemsAtParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    if (!Array.isArray(parsed.indexes)) {
        throw typeError("indexes", "an array", parsed.indexes);
    }
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const result: unknown[] = [];
    for (let position = 0; position < parsed.indexes.length; position += 1) {
        const index = readItem(parsed.indexes, position);
        if (typeof index !== "number") {
            continue;
        }
        const resolvedIndex = resolveIndex(index, array.length);
        if (resolvedIndex === undefined) {
            continue;
        }
        result.push(readItem(array, resolvedIndex));
    }
    return result;
}
