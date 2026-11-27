import type { ReduceAsyncParams } from "./reduce-async.types.js";
import { typeError } from "../utils/errors.utils.js";
import { assertFunction } from "../utils/iteratee.utils.js";

/**
 * Reduces the array from left to right, waiting for each step.
 *
 * There is no concurrency. `initialValue` is required. An empty array
 * resolves to that value. The returned promise rejects when `array` is not
 * an array, when `reducer` is not a function, when `initialValue` is
 * missing, or when `signal` is aborted before the start or before an item.
 *
 * @param params - {@link ReduceAsyncParams}.
 * @returns The final accumulator.
 * @throws {@link TypeError} When `array` is not an array, `reducer` is not a function, or `initialValue` is missing.
 * @example
 * await reduceAsync({
 *   array: [1, 2, 3],
 *   initialValue: 0,
 *   reducer: async (total, item) => total + item,
 * })
 */
export async function reduceAsync<Item, Result>(
    params: ReduceAsyncParams<Item, Result>,
): Promise<Result> {
    if (params === undefined || params === null) {
        throw typeError("array", "an array", undefined);
    }
    const received = params;
    const array = received.array;
    if (!Array.isArray(array)) {
        throw typeError("array", "an array", array);
    }
    assertFunction("reducer", received.reducer);
    if (received.initialValue === undefined) {
        throw typeError("initialValue", "provided", undefined);
    }
    const reducer = received.reducer;
    const signal = received.signal;
    if (signal?.aborted) {
        throw signal.reason;
    }
    let accumulator: Result = received.initialValue;
    for (let index = 0; index < array.length; index += 1) {
        if (signal?.aborted) {
            throw signal.reason;
        }
        accumulator = await reducer(
            accumulator,
            array[index] as Item,
            index,
            array,
        );
    }
    return accumulator;
}
