import type { MapAsyncParams } from "./map-async.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import {
    fulfilledValues,
    prepareAsyncWork,
    runInPool,
} from "../utils/async-pool.utils.js";

/**
 * Maps every item and preserves input order.
 *
 * At most `concurrency` mapper calls are in flight. `Infinity` is the
 * default. The returned promise rejects when `array` is not an array, when
 * `mapper` is not a function, when `concurrency` is unusable, or when
 * `signal` is already aborted. `stopOnError` defaults to true.
 *
 * @param params - {@link MapAsyncParams}.
 * @returns The mapped values, in input order.
 * @throws {@link TypeError} When `array` is not an array, `mapper` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @throws {AggregateError} When `stopOnError` is false and at least one mapper fails.
 * @example
 * await mapAsync({ array: [1, 2], mapper: async (item) => item + 1 })
 */
export async function mapAsync<Item, Result>(
    params: MapAsyncParams<Item, Result>,
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
    return fulfilledValues(outcomes);
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
