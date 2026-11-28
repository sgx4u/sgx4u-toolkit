import { rowsToColumns } from "../utils/columns.utils.js";

/**
 * Turns an array of tuples into columns.
 *
 * This is the inverse of `zip` for rows of equal length. The result length
 * is the longest tuple. A slot that is not an array counts as an empty row.
 * Shorter rows leave `undefined` in the missing cells. The input is not
 * mutated. A non-array returns `undefined`.
 *
 * @param array - Rows to turn into columns.
 * @returns The columns, or `undefined` when `array` is not an array.
 * @example
 * unzip([[1, 2], [3, 4]]);
 */
export function unzip(array: readonly unknown[]): unknown[][];
/**
 * @param array - A value that is not an array.
 * @returns `undefined` when `array` is not an array.
 */
export function unzip(
    array:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function unzip(array: unknown): unknown[][] | undefined {
    if (!Array.isArray(array)) {
        return undefined;
    }
    return rowsToColumns(array);
}
