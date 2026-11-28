import type { SortDefaults } from "../utils/sort.utils.js";
import type { CreateComparatorParams } from "./create-comparator.types.js";
import { typeError } from "../utils/errors.utils.js";
import { readParams } from "../utils/params.utils.js";
import {
    assertSortDefaults,
    comparatorForKeys,
    normalizeSortKeys,
} from "../utils/sort.utils.js";

/**
 * Builds a comparator from the same keys {@link sortBy} accepts.
 *
 * The result is `(left, right) => -1 | 0 | 1`. It does not take an array
 * and does not return `undefined`. A key function is called with the item,
 * index `0`, and a one-element array containing that item, because a
 * pairwise comparator has no source array. Invalid keys throw.
 *
 * @param params - `keys` and optional locale options.
 * @returns A comparator. `0` means the keys tied.
 * @throws {@link TypeError} When `params` is not an object, `keys` is not an array, a key is not an iteratee, `numeric` is not a boolean, or `locale` has the wrong type.
 * @throws {@link RangeError} When `direction`, `sensitivity`, `nulls`, or `locale` is not an allowed value.
 * @example
 * createComparator({ keys: ["name"], locale: "en-US" })
 */
export function createComparator<Item>(
    params: CreateComparatorParams<Item>,
): (left: Item, right: Item) => -1 | 0 | 1 {
    const resolved = readParams<CreateComparatorParams<Item>>(params);
    if (resolved === undefined) {
        throw typeError("keys", "an array", params);
    }
    const defaults = assertSortDefaults(sortDefaultsFrom(resolved));
    const keys = normalizeSortKeys(resolved.keys, defaults);
    return comparatorForKeys(keys);
}

/**
 * Copies defined sort options into a defaults object.
 *
 * @param source - Call-level options.
 * @returns Options safe to validate.
 */
function sortDefaultsFrom(source: {
    direction?: CreateComparatorParams<unknown>["direction"];
    locale?: string | readonly string[];
    numeric?: boolean;
    sensitivity?: CreateComparatorParams<unknown>["sensitivity"];
    nulls?: "first" | "last";
}): SortDefaults {
    const defaults: SortDefaults = {};
    if (source.direction !== undefined) {
        defaults.direction = source.direction;
    }
    if (source.locale !== undefined) {
        defaults.locale = source.locale;
    }
    if (source.numeric !== undefined) {
        defaults.numeric = source.numeric;
    }
    if (source.sensitivity !== undefined) {
        defaults.sensitivity = source.sensitivity;
    }
    if (source.nulls !== undefined) {
        defaults.nulls = source.nulls;
    }
    return defaults;
}
