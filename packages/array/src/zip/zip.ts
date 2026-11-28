import type { ZipMode, ZipParams } from "./zip.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertChoice } from "../utils/errors.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

const zipModes = ["longest", "shortest", "strict"] as const;

/**
 * Builds tuples from the items at the same index in each array.
 *
 * `"longest"` is the default. A missing entry is `fillValue`, which
 * defaults to `undefined`. `"shortest"` stops at the shortest array.
 * `"strict"` throws when the lengths differ. An empty list returns `[]`.
 * A slot that is not an array makes the call return `undefined`. An
 * unknown `mode` throws before the list is read.
 *
 * @param params - The arrays and the length policy.
 * @returns The tuples, or `undefined` when `arrays` is not an array of arrays.
 * @throws {@link RangeError} When `mode` is not `"longest"`, `"shortest"`, or `"strict"`, or when `mode` is `"strict"` and the lengths differ.
 * @example
 * zip({ arrays: [[1, 2], ["a"]] });
 */
export function zip<Item>(
    params: ZipParams<Item>,
): (Item | undefined)[][] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function zip(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function zip(params: unknown): unknown[][] | undefined {
    const resolved = readParams<ZipParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertChoice("mode", resolved.mode, zipModes);
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    const mode: ZipMode =
        resolved.mode === undefined ? "longest" : resolved.mode;
    const width = tupleCount(arrays, mode);
    return zipRows(arrays, width, resolved.fillValue);
}

/**
 * How many tuples `mode` keeps.
 *
 * @param arrays - The source arrays. The list may be empty.
 * @param mode - The length policy.
 * @returns The tuple count.
 * @throws {@link RangeError} When `mode` is `"strict"` and the lengths differ.
 */
function tupleCount(
    arrays: readonly (readonly unknown[])[],
    mode: ZipMode,
): number {
    if (arrays.length === 0) {
        return 0;
    }
    const lengths: number[] = [];
    for (const array of arrays) {
        lengths.push(array.length);
    }
    if (mode === "strict" && lengths.some((length) => length !== lengths[0])) {
        throw new RangeError(
            `\`arrays\` must have the same length when \`mode\` is "strict"; received ${lengths}.`,
        );
    }
    let width = lengths[0] ?? 0;
    for (const length of lengths) {
        if (mode === "shortest" && length < width) {
            width = length;
        }
        if (mode !== "shortest" && length > width) {
            width = length;
        }
    }
    return width;
}

/**
 * Reads one tuple per index up to `width`.
 *
 * @param arrays - The source arrays.
 * @param width - How many tuples to build.
 * @param fillValue - Value used when an array has no item at that index.
 * @returns The tuples.
 */
function zipRows(
    arrays: readonly (readonly unknown[])[],
    width: number,
    fillValue: unknown,
): unknown[][] {
    const rows: unknown[][] = [];
    for (let column = 0; column < width; column += 1) {
        const row: unknown[] = [];
        for (const array of arrays) {
            row.push(
                column < array.length ? readItem(array, column) : fillValue,
            );
        }
        rows.push(row);
    }
    return rows;
}
