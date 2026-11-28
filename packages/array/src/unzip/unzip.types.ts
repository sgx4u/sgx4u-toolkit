/**
 * Rows passed to {@link unzip}.
 *
 * Each slot should be a tuple. A slot that is not an array counts as an empty row.
 */
export type UnzipRows = readonly unknown[];
