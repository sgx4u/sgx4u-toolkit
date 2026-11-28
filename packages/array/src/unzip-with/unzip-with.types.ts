/**
 * Parameters for {@link unzipWith}.
 */
export interface UnzipWithParams<Result> {
    /**
     * Rows to turn into columns.
     *
     * A slot that is not an array counts as an empty row.
     */
    array: readonly unknown[];

    /**
     * Called with one column.
     *
     * A short row contributes `undefined` for each missing cell.
     */
    combine: (...columnItems: unknown[]) => Result;
}
