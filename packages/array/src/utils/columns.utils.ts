/**
 * Turns rows into columns, padding short rows with `undefined`.
 *
 * A slot that is not an array counts as an empty row. The input is not
 * mutated. Each column is a new array.
 *
 * @param rows - The source rows.
 * @returns Columns whose length is the number of rows.
 */
export function rowsToColumns(rows: readonly unknown[]): unknown[][] {
    let width = 0;
    const normalized: unknown[][] = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
        const row = rows[rowIndex];
        const cells = Array.isArray(row) ? Array.from(row) : [];
        normalized.push(cells);
        if (cells.length > width) {
            width = cells.length;
        }
    }
    const columns: unknown[][] = [];
    for (let columnIndex = 0; columnIndex < width; columnIndex += 1) {
        const column: unknown[] = [];
        for (const cells of normalized) {
            column.push(
                columnIndex < cells.length ? cells[columnIndex] : undefined,
            );
        }
        columns.push(column);
    }
    return columns;
}
