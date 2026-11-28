import type { FindAsyncParams } from "./find-async.types.js";
import type { AsyncWorkOptions } from "../utils/async-pool.utils.js";
import { prepareAsyncWork, runInPool } from "../utils/async-pool.utils.js";

/**
 * Returns the first item whose predicate is true, in input order.
 *
 * Later predicates may finish first. The result is still the earliest match.
 * Every item is visited. The returned promise rejects when `array` is not an
 * array, when `predicate` is not a function, when `concurrency` is unusable,
 * or when `signal` is already aborted. `stopOnError` defaults to true.
 *
 * @param params - {@link FindAsyncParams}.
 * @returns The first match, or `undefined` when none match.
 * @throws {@link TypeError} When `array` is not an array, `predicate` is not a function, or `stopOnError` is not a boolean.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 * @throws {AggregateError} When `stopOnError` is false and at least one predicate fails.
 * @example
 * await findAsync({
 *   array: ["a", "bb"],
 *   predicate: async (item) => item.length > 1,
 * })
 */
export async function findAsync<Item>(
    params: FindAsyncParams<Item>,
): Promise<Item | undefined> {
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
    for (let index = 0; index < items.length; index += 1) {
        const outcome = outcomes[index];
        if (outcome?.status === "fulfilled" && outcome.value === true) {
            return items[index] as Item;
        }
    }
    return undefined;
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
