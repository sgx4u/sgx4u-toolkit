import type { Equals } from "../types/equals.types.js";
import type { WithoutValuesParams } from "./without-values.types.js";
import { membershipFrom, resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Copies `array` without the items that appear in `values`.
 *
 * This is a difference against one list. Duplicates that are not excluded
 * stay, in the original order. The result is always a new array. `NaN`
 * matches `NaN`, and `-0` matches `0`, unless `equals` says otherwise.
 *
 * @param params - `array`, `values`, and an optional `equals`.
 * @returns The remaining items, or `undefined` when `array` or `values` is not an array.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * withoutValues({ array: [1, 2, 2, 3, 1], values: [2] })
 */
export function withoutValues<Item>(
    params: WithoutValuesParams<Item>,
): Item[] | undefined;
export function withoutValues(params: unknown): unknown[] | undefined;
export function withoutValues(params: unknown): unknown[] | undefined {
    const resolved = readParams<WithoutValuesParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const equals = resolveEquals(
        resolved.equals as Equals<unknown> | undefined,
    );
    const array = readArray<unknown>(resolved.array);
    const values = readArray<unknown>(resolved.values);
    if (array === undefined || values === undefined) {
        return undefined;
    }
    const excluded = membershipFrom(values, equals);
    const result: unknown[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        if (excluded.has(item)) {
            continue;
        }
        result.push(item);
    }
    return result;
}
