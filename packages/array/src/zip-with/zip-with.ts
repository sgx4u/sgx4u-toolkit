import type { ZipMode } from "../zip/zip.types.js";
import type { ZipWithParams } from "./zip-with.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertChoice } from "../utils/errors.utils.js";
import { assertFunction } from "../utils/iteratee.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

const zipModes = ["longest", "shortest", "strict"] as const;

/**
 * Combines the items at the same index with `combine`.
 *
 * The length policy matches `zip`. `combine` is required and is checked
 * before the list is read. An empty list returns `[]` and does not call
 * `combine`. A slot that is not an array returns `undefined`.
 *
 * @param params - The arrays, the combiner, and the length policy.
 * @returns The combined values, or `undefined` when `arrays` is not an array of arrays.
 * @throws {@link TypeError} When `combine` is not a function.
 * @throws {@link RangeError} When `mode` is unknown, or when `mode` is `"strict"` and the lengths differ.
 * @example
 * zipWith({ arrays: [[1, 2], [3, 4]], combine: (left, right) => left + right });
 */
export function zipWith<Result>(
    params: ZipWithParams<Result>,
): Result[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function zipWith(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function zipWith(params: unknown): unknown[] | undefined {
    const resolved = readParams<ZipWithParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const combine = readCombine(resolved.combine);
    assertChoice("mode", resolved.mode, zipModes);
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    const mode: ZipMode =
        resolved.mode === undefined ? "longest" : resolved.mode;
    return combineRows(
        arrays,
        tupleCount(arrays, mode),
        resolved.fillValue,
        combine,
    );
}

/**
 * @param combine - The candidate combiner.
 * @returns The combiner.
 * @throws {@link TypeError} When `combine` is not a function.
 */
function readCombine(combine: unknown): (...items: unknown[]) => unknown {
    assertFunction("combine", combine);
    return combine as (...items: unknown[]) => unknown;
}

/**
 * @param arrays - The source arrays.
 * @param mode - The length policy.
 * @returns How many tuples to combine.
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
 * @param arrays - The source arrays.
 * @param width - How many tuples to combine.
 * @param fillValue - Value used when an array has no item at that index.
 * @param combine - Combines one tuple.
 * @returns The combined values.
 */
function combineRows(
    arrays: readonly (readonly unknown[])[],
    width: number,
    fillValue: unknown,
    combine: (...items: unknown[]) => unknown,
): unknown[] {
    const result: unknown[] = [];
    for (let column = 0; column < width; column += 1) {
        const row: unknown[] = [];
        for (const array of arrays) {
            row.push(
                column < array.length ? readItem(array, column) : fillValue,
            );
        }
        result.push(combine(...row));
    }
    return result;
}
