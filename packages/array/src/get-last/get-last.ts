import type { GetLastParams } from "./get-last.types.js";
import { readItem } from "../utils/array.utils.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";

/**
 * Returns the last item of an array.
 *
 * A bare array and `{ array, defaultValue }` are both accepted. The array
 * is not mutated. An empty array returns `defaultValue` when that property
 * is present, including `0` and `false`. When the property is absent, an
 * empty array returns `undefined`. A hole in the last position is
 * `undefined` and does not fall through to `defaultValue`. A non-array
 * returns `undefined`.
 *
 * @param array - The array to read.
 * @returns The last item, or `undefined` when the array is empty or the input is not an array.
 * @example
 * getLast([1, 2, 3]);
 */
export function getLast<Item>(array: readonly Item[]): Item | undefined;
/**
 * @param params - `array`, and `defaultValue` when the array may be empty.
 * @returns The last item, or `defaultValue` when `array` is empty.
 */
export function getLast<Item, DefaultValue>(
    params: GetLastParams<Item, DefaultValue> & {
        defaultValue: DefaultValue;
    },
): Item | DefaultValue;
/**
 * @param params - `array` without a `defaultValue` property.
 * @returns The last item, or `undefined` when `array` is empty.
 */
export function getLast<Item>(params: GetLastParams<Item>): Item | undefined;
/**
 * @param input - A value that is not an array or a params object.
 * @returns `undefined` when `input` cannot be read as an array.
 */
export function getLast(
    input:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getLast(input: unknown): unknown {
    const params = readArrayParams<GetLastParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    if (array.length === 0) {
        if ("defaultValue" in params) {
            return params.defaultValue;
        }
        return undefined;
    }
    return readItem(array, array.length - 1);
}
