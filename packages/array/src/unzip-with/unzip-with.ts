import type { UnzipWithParams } from "./unzip-with.types.js";
import { rowsToColumns } from "../utils/columns.utils.js";
import { assertFunction } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Turns rows into columns and combines each column.
 *
 * Shorter rows contribute `undefined` for missing cells. A slot that is
 * not an array counts as an empty row. `combine` is checked before the
 * source array is read. The input is not mutated.
 *
 * @param params - The rows and the column combiner.
 * @returns One combined value per column, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `combine` is not a function.
 * @example
 * unzipWith({
 *     array: [[1, 2], [3, 4]],
 *     combine: (left, right) => Number(left) + Number(right),
 * });
 */
export function unzipWith<Result>(
    params: UnzipWithParams<Result>,
): Result[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function unzipWith(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function unzipWith(params: unknown): unknown[] | undefined {
    const resolved = readParams<UnzipWithParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const combine = readCombine(resolved.combine);
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return rowsToColumns(array).map((column) => combine(...column));
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
