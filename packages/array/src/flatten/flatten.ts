import type { FlattenParams } from "./flatten.types.js";
import { copyArray, readItem } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";

/**
 * Flattens nested arrays by `depth` levels and returns a new array.
 *
 * Pass a bare array to flatten one level, or `{ array, depth }`. `depth`
 * defaults to `1`. `0` returns a shallow copy. Only arrays are opened.
 * Sets, strings, typed arrays, and other iterables stay as single items.
 * A present `depth` is checked before the source array is read. The input
 * is not mutated.
 *
 * @param input - A bare array, or {@link FlattenParams}.
 * @returns The flattened array, or `undefined` when the source is not an array.
 * @throws {@link TypeError} When `depth` is present and is not a number.
 * @throws {@link RangeError} When `depth` is negative, fractional, or not finite.
 * @example
 * flatten([1, [2, [3]]]);
 */
export function flatten(array: readonly unknown[]): unknown[];
/**
 * @param params - `array` and an optional `depth`.
 * @returns The flattened array, or `undefined` when `array` is not an array.
 */
export function flatten(params: FlattenParams): unknown[] | undefined;
/**
 * @param input - A value that is not an array or a params object.
 * @returns `undefined` when `input` is not an object.
 */
export function flatten(
    input:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function flatten(input: unknown): unknown[] | undefined {
    const resolved = readArrayParams<FlattenParams>(input);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.depth !== undefined) {
        assertNonNegativeInteger("depth", resolved.depth);
    }
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const depth = resolved.depth === undefined ? 1 : resolved.depth;
    return flattenToDepth(array, depth);
}

/**
 * Opens `depth` levels of nested arrays.
 *
 * @param array - The source array.
 * @param depth - How many levels to open. `0` copies the array.
 * @returns A new dense array.
 */
function flattenToDepth(array: readonly unknown[], depth: number): unknown[] {
    if (depth === 0) {
        return copyArray(array);
    }
    const result: unknown[] = [];
    const stack: Array<{
        source: readonly unknown[];
        index: number;
        remaining: number;
    }> = [{ source: array, index: 0, remaining: depth }];
    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        if (current === undefined || current.index >= current.source.length) {
            stack.pop();
            continue;
        }
        const item = readItem(current.source, current.index);
        current.index += 1;
        if (Array.isArray(item) && current.remaining > 0) {
            stack.push({
                source: item,
                index: 0,
                remaining: current.remaining - 1,
            });
            continue;
        }
        result.push(item);
    }
    return result;
}
