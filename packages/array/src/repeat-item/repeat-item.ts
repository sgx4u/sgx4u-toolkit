import type { RepeatItemParams } from "./repeat-item.types.js";
import { typeError } from "../utils/errors.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";

/**
 * Returns `count` copies of the same item reference.
 *
 * `count` of `0` returns `[]`. Objects are not cloned. This function never
 * returns `undefined`.
 *
 * @param params - The item and the count.
 * @returns The repeated item.
 * @throws {@link TypeError} When `count` is not a number, or when the argument is not an object.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * repeatItem({ item: "a", count: 3 });
 */
export function repeatItem<Item>(params: RepeatItemParams<Item>): Item[];
export function repeatItem(params: unknown): unknown[] {
    if (
        params === null ||
        typeof params !== "object" ||
        Array.isArray(params)
    ) {
        throw typeError(
            "count",
            "a finite integer greater than or equal to 0",
            params,
        );
    }
    const resolved = params as RepeatItemParams<unknown>;
    const count = assertNonNegativeInteger("count", resolved.count);
    const result: unknown[] = [];
    for (let index = 0; index < count; index += 1) {
        result.push(resolved.item);
    }
    return result;
}
