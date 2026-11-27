import type { FlatMapAsyncParams } from "./flat-map-async.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import {
    fulfilledValues,
    prepareAsyncWork,
    runInPool,
} from "../utils/async-pool.utils.js";

/**
 * Maps every item and flattens the results one level.
 *
 * A non-array result is one item. An array result contributes its elements
 * and is not flattened further. The returned promise rejects when `array`
 * is not an array, when `mapper` is not a function, when `concurrency` is
 * unusable, or when `signal` is already aborted. `stopOnError` defaults to
 * true. Order matches the input.
 *
 * @param params - {@link FlatMapAsyncParams}.
 * @returns The flattened values.
 * @throws {@link TypeError} When `array` is not an array, `mapper` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @throws {AggregateError} When `stopOnError` is false and at least one mapper fails.
 * @example
 * await flatMapAsync({
 *   array: [1, 2],
 *   mapper: async (item) => (item === 1 ? [item, item] : item),
 * })
 */
export async function flatMapAsync<Item, Result>(
    params: FlatMapAsyncParams<Item, Result>,
): Promise<Result[]> {
    const { items, work } = prepareAsyncWork<Item>(
        params?.array,
        "mapper",
        params?.mapper,
        asyncOptions(params),
    );
    if (work.signal?.aborted) {
        throw work.signal.reason;
    }
    const outcomes = await runInPool(items, work, params.mapper);
    return flattenOne(fulfilledValues(outcomes));
}

/**
 * @param values - Mapper results, in input order.
 * @returns Those results flattened one level.
 */
function flattenOne<Result>(
    values: readonly (Result | readonly Result[])[],
): Result[] {
    const flattened: Result[] = [];
    for (const value of values) {
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index += 1) {
                flattened.push(value[index] as Result);
            }
            continue;
        }
        flattened.push(value as Result);
    }
    return flattened;
}

/**
 * @param params - Concurrency, signal, and `stopOnError`, any of which may be omitted.
 * @returns Options with the omitted fields left absent.
 */
function asyncOptions(
    params:
        | {
              concurrency?: unknown;
              signal?: AbortSignal;
              stopOnError?: unknown;
          }
        | null
        | undefined,
): AsyncWorkOptions {
    const options: AsyncWorkOptions = {};
    if (params === null || params === undefined) {
        return options;
    }
    if (params.concurrency !== undefined) {
        options.concurrency = params.concurrency;
    }
    if (params.signal !== undefined) {
        options.signal = params.signal;
    }
    if (params.stopOnError !== undefined) {
        options.stopOnError = params.stopOnError;
    }
    return options;
}
