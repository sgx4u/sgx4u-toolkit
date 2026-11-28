import type { ForEachAsyncParams } from "./for-each-async.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import { prepareAsyncWork, runInPool } from "../utils/async-pool.utils.js";

/**
 * Visits every item. The promise resolves to `undefined`.
 *
 * The returned promise rejects when `array` is not an array, when `visitor`
 * is not a function, when `concurrency` is unusable, or when `signal` is
 * already aborted. `stopOnError` defaults to true.
 *
 * @param params - {@link ForEachAsyncParams}.
 * @returns A promise that resolves to `undefined` after every visit settles.
 * @throws {@link TypeError} When `array` is not an array, `visitor` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @throws {AggregateError} When `stopOnError` is false and at least one visitor fails.
 * @example
 * await forEachAsync({ array: [1, 2], visitor: async (item) => item })
 */
export async function forEachAsync<Item>(
    params: ForEachAsyncParams<Item>,
): Promise<void> {
    const { items, work } = prepareAsyncWork<Item>(
        params?.array,
        "visitor",
        params?.visitor,
        asyncOptions(params),
    );
    if (work.signal?.aborted) {
        throw work.signal.reason;
    }
    await runInPool(items, work, params.visitor);
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
