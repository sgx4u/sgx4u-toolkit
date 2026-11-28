import type { FilterAsyncParams } from "./filter-async.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import { prepareAsyncWork, runInPool } from "../utils/async-pool.utils.js";

/**
 * Keeps the items whose predicate returns true, in input order.
 *
 * The returned promise rejects when `array` is not an array, when
 * `predicate` is not a function, when `concurrency` is unusable, or when
 * `signal` is already aborted. `stopOnError` defaults to true.
 *
 * @param params - {@link FilterAsyncParams}.
 * @returns The kept items.
 * @throws {@link TypeError} When `array` is not an array, `predicate` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @throws {AggregateError} When `stopOnError` is false and at least one predicate fails.
 * @example
 * await filterAsync({
 *   array: [1, 2, 3],
 *   predicate: async (item) => item % 2 === 0,
 * })
 */
export async function filterAsync<Item>(
    params: FilterAsyncParams<Item>,
): Promise<Item[]> {
    const { items, work } = prepareAsyncWork<Item>(
        params?.array,
        "predicate",
        params?.predicate,
        asyncOptions(params),
    );
    if (work.signal?.aborted) {
        throw work.signal.reason;
    }
    const outcomes = await runInPool(items, work, params.predicate);
    const kept: Item[] = [];
    for (let index = 0; index < items.length; index += 1) {
        const outcome = outcomes[index];
        if (outcome?.status === "fulfilled" && outcome.value === true) {
            kept.push(items[index] as Item);
        }
    }
    return kept;
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
