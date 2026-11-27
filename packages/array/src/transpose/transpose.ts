import { rowsToColumns } from "../utils/columns.utils.js";

/**
 * Turns rows into columns.
 *
 * The result width is the longest row. A shorter row is padded with
 * `undefined`. A slot that is not an array counts as an empty row. An
 * empty matrix returns `[]`. The input is not mutated. A non-array
 * returns `undefined`.
 *
 * @param matrix - Rows to transpose. Pass the matrix itself, not a params object.
 * @returns The columns, or `undefined` when `matrix` is not an array.
 * @example
 * transpose([[1, 2], [3, 4]]);
 */
export function transpose(matrix: readonly unknown[]): unknown[][];
/**
 * @param matrix - A value that is not an array.
 * @returns `undefined` when `matrix` is not an array.
 */
export function transpose(
    matrix:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function transpose(matrix: unknown): unknown[][] | undefined {
    if (!Array.isArray(matrix)) {
        return undefined;
    }
    return rowsToColumns(matrix);
}
