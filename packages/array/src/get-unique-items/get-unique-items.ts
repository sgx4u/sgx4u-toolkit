import type { Equals } from "../types/equals.types.js";
import type {
    GetUniqueItemsParams,
    UniqueKeep,
} from "./get-unique-items.types.js";
import { assertChoice } from "../utils/errors.utils.js";
import { resolveEquals, uniqueInOrder } from "../utils/equality.utils.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";

const keepNames = ["first", "last"] as const;

/**
 * Drops duplicate items, keeping the first or last occurrence.
 *
 * Pass a bare array, or `{ array, equals, keep }`. Order is the order of
 * the kept occurrences. `keep` defaults to `"first"`. `"last"` keeps the
 * later item and still walks left to right, so `[1, 2, 1]` becomes
 * `[2, 1]`. The default equality is SameValueZero.
 *
 * @param input - A bare array, or params with `array`.
 * @returns The kept items. A bare array always returns an array. Params return `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @throws {@link RangeError} When `keep` is not `"first"` or `"last"`.
 * @example
 * getUniqueItems([1, 2, 1, 3])
 */
export function getUniqueItems<Item>(array: readonly Item[]): Item[];
export function getUniqueItems<Item>(
    params: GetUniqueItemsParams<Item>,
): Item[] | undefined;
export function getUniqueItems(input: unknown): unknown[] | undefined;
export function getUniqueItems(input: unknown): unknown[] | undefined {
    const resolved = readArrayParams<GetUniqueItemsParams<unknown>>(input);
    if (resolved === undefined) {
        return undefined;
    }
    assertChoice("keep", resolved.keep, keepNames);
    const equals = resolveEquals(
        resolved.equals as Equals<unknown> | undefined,
    );
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const keep: UniqueKeep = resolved.keep ?? "first";
    return uniqueInOrder(array, equals, keep);
}
