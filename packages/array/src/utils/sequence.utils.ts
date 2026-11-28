import type { ArrayPatch } from "../types/patch.types.js";
import type { Equals } from "../types/equals.types.js";

/**
 * LCS lengths of every remaining suffix pair.
 *
 * `table[row][column]` is the length of an LCS of `first` from `row` onward
 * and `second` from `column` onward. The extra last row and column are zero.
 *
 * @param first - The previous sequence.
 * @param second - The next sequence.
 * @param equals - Item equality.
 * @returns The suffix table.
 */
function suffixLengths<Item>(
    first: readonly Item[],
    second: readonly Item[],
    equals: Equals<Item>,
): number[][] {
    const rowCount = first.length + 1;
    const columnCount = second.length + 1;
    const table: number[][] = [];
    for (let row = 0; row < rowCount; row += 1) {
        table.push(new Array<number>(columnCount).fill(0));
    }
    for (let row = first.length - 1; row >= 0; row -= 1) {
        for (let column = second.length - 1; column >= 0; column -= 1) {
            const currentRow = table[row] as number[];
            if (equals(first[row] as Item, second[column] as Item)) {
                const diagonal = (table[row + 1] as number[])[column + 1] ?? 0;
                currentRow[column] = diagonal + 1;
            } else {
                const skipFirst = (table[row + 1] as number[])[column] ?? 0;
                const skipSecond = currentRow[column + 1] ?? 0;
                currentRow[column] =
                    skipFirst > skipSecond ? skipFirst : skipSecond;
            }
        }
    }
    return table;
}

/**
 * One LCS, preferring earlier items of `first` when several exist.
 *
 * The walk takes a match when the items are equal. When they differ and
 * both skips preserve the same length, it skips `second`, which leaves the
 * earlier item of `first` available for a later match.
 *
 * @param first - The previous sequence. Result items come from here.
 * @param second - The next sequence.
 * @param equals - Item equality.
 * @returns Items of one longest common subsequence.
 */
export function longestCommonSubsequence<Item>(
    first: readonly Item[],
    second: readonly Item[],
    equals: Equals<Item>,
): Item[] {
    const table = suffixLengths(first, second, equals);
    const result: Item[] = [];
    let row = 0;
    let column = 0;
    while (row < first.length && column < second.length) {
        if (equals(first[row] as Item, second[column] as Item)) {
            result.push(first[row] as Item);
            row += 1;
            column += 1;
            continue;
        }
        const skipSecond = (table[row] as number[])[column + 1] ?? 0;
        const skipFirst = (table[row + 1] as number[])[column] ?? 0;
        if (skipSecond >= skipFirst) {
            column += 1;
        } else {
            row += 1;
        }
    }
    return result;
}

/**
 * A sequence diff as keep, insert, and remove runs.
 *
 * The runs turn `first` into `second`. Adjacent operations of the same kind
 * are one run. Items in a keep run come from `second`.
 *
 * @param first - The previous sequence.
 * @param second - The next sequence.
 * @param equals - Item equality.
 * @returns The patch.
 */
export function sequencePatch<Item>(
    first: readonly Item[],
    second: readonly Item[],
    equals: Equals<Item>,
): ArrayPatch<Item>[] {
    const table = suffixLengths(first, second, equals);
    const operations: Array<{ type: ArrayPatch<Item>["type"]; item: Item }> =
        [];
    let row = 0;
    let column = 0;
    while (row < first.length && column < second.length) {
        if (equals(first[row] as Item, second[column] as Item)) {
            operations.push({ type: "keep", item: second[column] as Item });
            row += 1;
            column += 1;
            continue;
        }
        const skipSecond = (table[row] as number[])[column + 1] ?? 0;
        const skipFirst = (table[row + 1] as number[])[column] ?? 0;
        if (skipSecond >= skipFirst) {
            operations.push({ type: "insert", item: second[column] as Item });
            column += 1;
        } else {
            operations.push({ type: "remove", item: first[row] as Item });
            row += 1;
        }
    }
    while (row < first.length) {
        operations.push({ type: "remove", item: first[row] as Item });
        row += 1;
    }
    while (column < second.length) {
        operations.push({ type: "insert", item: second[column] as Item });
        column += 1;
    }
    return coalesceOperations(operations);
}

/**
 * Groups a flat list of operations into runs.
 *
 * @param operations - One item per operation, in order.
 * @returns Runs with their items.
 */
function coalesceOperations<Item>(
    operations: readonly { type: ArrayPatch<Item>["type"]; item: Item }[],
): ArrayPatch<Item>[] {
    const runs: ArrayPatch<Item>[] = [];
    for (const operation of operations) {
        const previous = runs[runs.length - 1];
        if (previous !== undefined && previous.type === operation.type) {
            previous.items.push(operation.item);
            continue;
        }
        if (operation.type === "keep") {
            runs.push({ type: "keep", items: [operation.item] });
        } else if (operation.type === "insert") {
            runs.push({ type: "insert", items: [operation.item] });
        } else {
            runs.push({ type: "remove", items: [operation.item] });
        }
    }
    return runs;
}

/**
 * Shared leading items.
 *
 * @param first - The first sequence.
 * @param second - The second sequence.
 * @param equals - Item equality.
 * @returns The shared prefix. Items come from `first`.
 */
export function commonPrefix<Item>(
    first: readonly Item[],
    second: readonly Item[],
    equals: Equals<Item>,
): Item[] {
    const result: Item[] = [];
    const limit = first.length < second.length ? first.length : second.length;
    for (let index = 0; index < limit; index += 1) {
        const left = first[index] as Item;
        if (!equals(left, second[index] as Item)) {
            break;
        }
        result.push(left);
    }
    return result;
}

/**
 * Shared trailing items, in forward order.
 *
 * @param first - The first sequence.
 * @param second - The second sequence.
 * @param equals - Item equality.
 * @returns The shared suffix. Items come from `first`.
 */
export function commonSuffix<Item>(
    first: readonly Item[],
    second: readonly Item[],
    equals: Equals<Item>,
): Item[] {
    const reversed: Item[] = [];
    let firstIndex = first.length - 1;
    let secondIndex = second.length - 1;
    while (firstIndex >= 0 && secondIndex >= 0) {
        const left = first[firstIndex] as Item;
        if (!equals(left, second[secondIndex] as Item)) {
            break;
        }
        reversed.push(left);
        firstIndex -= 1;
        secondIndex -= 1;
    }
    reversed.reverse();
    return reversed;
}
