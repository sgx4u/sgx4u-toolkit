import type { PadArrayStartParams } from "./pad-array-start.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Pads the start of a copy until it reaches `length`.
 *
 * A source that is already at least `length` returns a shallow copy.
 * A present `length` is checked before the source array is read. The
 * input is not mutated. Each pad slot stores the same `value` reference.
 *
 * @param params - The source array, the target length, and the pad value.
 * @returns The padded array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `length` is present and is not a number, or when a real array omits `length`.
 * @throws {@link RangeError} When `length` is not a finite integer greater than or equal to 0.
 * @example
 * padArrayStart({ array: [1, 2], length: 4, value: 0 });
 */
export function padArrayStart<Item>(
    params: PadArrayStartParams<Item>,
): Item[] | undefined {
    const resolved = readParams<PadArrayStartParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const length = assertNonNegativeInteger("length", resolved.length);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return padStart(array, length, resolved.value);
}

/**
 * Pads `array` on the left, or copies it when it is already long enough.
 *
 * @param array - The source array.
 * @param length - The target length.
 * @param value - The pad value.
 * @returns The new array.
 */
function padStart<Item>(
    array: readonly Item[],
    length: number,
    value: Item,
): Item[] {
    if (array.length >= length) {
        return copyArray(array);
    }
    const padding = new Array<Item>(length - array.length).fill(value);
    return padding.concat(copyArray(array));
}
