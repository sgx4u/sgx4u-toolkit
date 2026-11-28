import type { CreateTimesParams } from "./create-times.types.js";
import { typeError } from "../utils/errors.utils.js";
import { assertFunction } from "../utils/iteratee.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";

/**
 * Builds `[0, 1, ..., count - 1]`, or the mapped values.
 *
 * `count` of `0` returns `[]`. A present `mapper` that is not a function
 * throws. This function never returns `undefined`.
 *
 * @param params - The count and an optional mapper.
 * @returns The indexes, or the mapped values.
 * @throws {@link TypeError} When `count` is not a number, when the argument is not an object, or when `mapper` is present and is not a function.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * createTimes({ count: 3, mapper: (index) => index * 2 });
 */
export function createTimes(params: { count: number }): number[];
/**
 * @param params - `count` and `mapper`.
 * @returns The mapped values.
 */
export function createTimes<Item>(params: CreateTimesParams<Item>): Item[];
export function createTimes(params: unknown): unknown[] {
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
    const resolved = params as CreateTimesParams<unknown>;
    const count = assertNonNegativeInteger("count", resolved.count);
    if (resolved.mapper !== undefined) {
        assertFunction("mapper", resolved.mapper);
    }
    const mapper = resolved.mapper;
    const result: unknown[] = [];
    for (let index = 0; index < count; index += 1) {
        result.push(mapper === undefined ? index : mapper(index));
    }
    return result;
}
