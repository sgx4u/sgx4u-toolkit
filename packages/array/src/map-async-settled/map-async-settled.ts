import type { MapAsyncSettledParams } from "./map-async-settled.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import { prepareAsyncWork, runInPool } from "../utils/async-pool.utils.js";

/**
 * Maps every item and returns a settled outcome for each one.
 *
 * A mapper failure becomes `{ status: "rejected", reason }`. It does not
 * reject the returned promise. The promise still rejects when `array` is
 * not an array, when `mapper` is not a function, when `concurrency` is
 * unusable, or when `signal` is aborted. Outcomes stay in input order.
 *
 * @param params - {@link MapAsyncSettledParams}.
 * @returns One settled result per item.
 * @throws {@link TypeError} When `array` is not an array, `mapper` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @example
 * await mapAsyncSettled({
 *   array: [1, 2],
 *   mapper: async (item) => {
 *     if (item === 2) {
 *       throw new Error("nope");
 *     }
 *     return item;
 *   },
 * })
 */
export async function mapAsyncSettled<Item, Result>(
    params: MapAsyncSettledParams<Item, Result>,
): Promise<PromiseSettledResult<Result>[]> {
    const { items, work } = prepareAsyncWork<Item>(
        params?.array,
        "mapper",
        params?.mapper,
        asyncOptions(params),
    );
    if (work.signal?.aborted) {
        throw work.signal.reason;
    }
    return runInPool(items, work, params.mapper, true);
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
