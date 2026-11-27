import { readItem } from "../utils/array.utils.js";

/**
 * Flattens nested arrays until none remain.
 *
 * Only arrays are opened. A `Set`, a string, a typed array, or another
 * iterable stays as one item. The input is not mutated. A non-array
 * returns `undefined`.
 *
 * @param array - The source array. Pass the array itself, not a params object.
 * @returns The flattened items, or `undefined` when `array` is not an array.
 * @example
 * flattenDeep([1, [2, [3, [4]]], 5]);
 */
export function flattenDeep(array: readonly unknown[]): unknown[];
/**
 * @param array - A value that is not an array.
 * @returns `undefined` when `array` is not an array.
 */
export function flattenDeep(
    array:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function flattenDeep(array: unknown): unknown[] | undefined {
    if (!Array.isArray(array)) {
        return undefined;
    }
    return flattenUntilDone(array);
}

/**
 * Opens every nested array, using an explicit stack.
 *
 * @param array - The source array.
 * @returns A new dense array with no nested arrays.
 */
function flattenUntilDone(array: readonly unknown[]): unknown[] {
    const result: unknown[] = [];
    const stack: Array<{ source: readonly unknown[]; index: number }> = [
        { source: array, index: 0 },
    ];
    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        if (current === undefined || current.index >= current.source.length) {
            stack.pop();
            continue;
        }
        const item = readItem(current.source, current.index);
        current.index += 1;
        if (Array.isArray(item)) {
            stack.push({ source: item, index: 0 });
            continue;
        }
        result.push(item);
    }
    return result;
}
