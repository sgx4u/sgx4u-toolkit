import type { CreateWindowsParams } from "./create-windows.types.js";
import { assertPositiveInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Copies fixed windows starting at `0`, `step`, `2 * step`, and so on.
 *
 * `step` defaults to `1` and `partial` defaults to `true`. A partial window
 * is shorter than `size` because it reaches the end of the array. Set
 * `partial` to `false` to drop it. The input is not mutated.
 *
 * @param params - `array`, `size`, and optional `step` and `partial`.
 * @returns The windows, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `size` or `step` is not a number.
 * @throws {@link RangeError} When `size` or `step` is not a positive finite integer.
 * @example
 * createWindows({ array: [1, 2, 3, 4], size: 3, step: 2 })
 */
export function createWindows<Item>(
    params: CreateWindowsParams<Item>,
): Item[][] | undefined;
export function createWindows(params: unknown): unknown[][] | undefined;
export function createWindows(params: unknown): unknown[][] | undefined {
    const resolved = readParams<CreateWindowsParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const size = assertPositiveInteger("size", resolved.size);
    const step = assertPositiveInteger("step", resolved.step ?? 1);
    const partial = resolved.partial ?? true;
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return collectWindows(array, size, step, partial !== false);
}

/**
 * Copies each window that starts on a step boundary.
 *
 * @param array - The source array.
 * @param size - Full window length.
 * @param step - Distance between window starts.
 * @param partial - Whether a short trailing window is kept.
 * @returns New windows.
 */
function collectWindows<Item>(
    array: readonly Item[],
    size: number,
    step: number,
    partial: boolean,
): Item[][] {
    const windows: Item[][] = [];
    for (let start = 0; start < array.length; start += step) {
        const end = Math.min(start + size, array.length);
        if (!partial && end - start < size) {
            break;
        }
        const window: Item[] = [];
        for (let index = start; index < end; index += 1) {
            window.push(array[index] as Item);
        }
        windows.push(window);
    }
    return windows;
}
