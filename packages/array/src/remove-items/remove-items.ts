import type { Equals } from "../types/equals.types.js";
import type { Predicate } from "../types/iteratee.types.js";
import type { RemoveItemsParams } from "./remove-items.types.js";
import { typeError } from "../utils/errors.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Removes items that match a predicate or equal one of a list of values.
 *
 * At least one of `predicate` and `values` is required when `array` is an
 * array. When both are set, an item is removed when either matches. A
 * present predicate that is not a function, a present `values` that is not
 * an array, and a present `equals` that is not a function throw before the
 * source array is read. `NaN` matches `NaN` under the default comparison.
 *
 * @param params - The source array and the predicate, values, or both.
 * @returns The kept items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When neither matcher is available for a real array, when a present matcher has the wrong type, or when `equals` is present and is not a function.
 * @example
 * removeItems({ array: [1, 2, 3, 2], values: [2] });
 */
export function removeItems<Item>(
    params: RemoveItemsParams<Item>,
): Item[] | undefined {
    const resolved = readParams<RemoveItemsParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.predicate === undefined && resolved.values === undefined) {
        throw new TypeError("`removeItems` requires `predicate` or `values`.");
    }
    if (
        resolved.predicate !== undefined &&
        typeof resolved.predicate !== "function"
    ) {
        throw typeError("predicate", "a function", resolved.predicate);
    }
    if (resolved.values !== undefined && !Array.isArray(resolved.values)) {
        throw typeError("values", "an array", resolved.values);
    }
    const equals = resolveEquals(resolved.equals);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const predicate =
        resolved.predicate === undefined
            ? undefined
            : assertPredicate<Item>("predicate", resolved.predicate);
    const values = Array.isArray(resolved.values) ? resolved.values : undefined;
    return rejectMatches(array, predicate, values, equals);
}

/**
 * Copies items that match neither the predicate nor `values`.
 *
 * @param array - The source array.
 * @param predicate - Optional predicate. Absent when the caller passed only values.
 * @param values - Optional values. Absent when the caller passed only a predicate.
 * @param equals - Item equality.
 * @returns The kept items.
 */
function rejectMatches<Item>(
    array: readonly Item[],
    predicate: Predicate<Item> | undefined,
    values: readonly Item[] | undefined,
    equals: Equals<Item>,
): Item[] {
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const matchesPredicate =
            predicate !== undefined && predicate(item, index, array);
        const matchesValue =
            values !== undefined && values.some((value) => equals(item, value));
        if (matchesPredicate || matchesValue) {
            continue;
        }
        result.push(item);
    }
    return result;
}
