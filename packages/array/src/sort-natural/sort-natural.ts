import type { SortKey } from "../types/sort.types.js";
import type { SortByParams } from "../sort-by/sort-by.types.js";
import type { SortNaturalParams } from "./sort-natural.types.js";
import { sortBy } from "../sort-by/sort-by.js";
import { readParams } from "../utils/params.utils.js";

/**
 * Sorts a copy with numeric natural order.
 *
 * Strings are compared with a collator whose `numeric` option is `true`,
 * so `"item2"` comes before `"item10"`. Real numbers still compare as
 * numbers. `direction` defaults to `"ascending"`. `nulls` defaults to
 * `"last"` and does not flip when the direction is descending. The sort is
 * stable. A function `by` is called once per item, with the item, its
 * original index, and the source array.
 *
 * @param params - `array`, and optional `by`, `direction`, `locale`, and `nulls`.
 * @returns The sorted copy, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or `locale` has the wrong type.
 * @throws {@link RangeError} When `direction`, `nulls`, or `locale` is not an allowed value.
 * @example
 * sortNatural({ array: ["item10", "item2", "item1"], locale: "en-US" })
 */
export function sortNatural<Item>(
    params: SortNaturalParams<Item>,
): Item[] | undefined;
export function sortNatural(params: unknown): unknown[] | undefined;
export function sortNatural(params: unknown): unknown[] | undefined {
    const resolved = readParams<SortNaturalParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const by =
        resolved.by === undefined
            ? (item: unknown) => item
            : (resolved.by as SortKey<unknown>);
    const forwarded: SortByParams<unknown> = {
        array: resolved.array as readonly unknown[],
        keys: [by],
        numeric: true,
    };
    if (resolved.direction !== undefined) {
        forwarded.direction = resolved.direction;
    }
    if (resolved.locale !== undefined) {
        forwarded.locale = resolved.locale;
    }
    if (resolved.nulls !== undefined) {
        forwarded.nulls = resolved.nulls;
    }
    return sortBy(forwarded);
}
