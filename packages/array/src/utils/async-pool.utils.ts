import { assertFunction } from "./iteratee.utils.js";
import { assertConcurrency } from "./number.utils.js";
import { typeError } from "./errors.utils.js";

/**
 * Options shared by the concurrent async helpers.
 */
export interface AsyncWorkOptions {
    concurrency?: unknown;
    signal?: AbortSignal;
    stopOnError?: unknown;
}

/**
 * Validated options for one async run.
 */
export interface ResolvedAsyncWork {
    concurrency: number;
    signal: AbortSignal | undefined;
    stopOnError: boolean;
}

/**
 * Checks the array, the worker function, and the concurrency options.
 *
 * An already-aborted signal is reported through the returned options. The
 * caller rejects with `signal.reason`.
 *
 * @param array - The candidate array.
 * @param workerName - Argument name of the mapper, predicate, or visitor.
 * @param worker - The candidate function.
 * @param options - Concurrency, signal, and `stopOnError`.
 * @returns The array and the validated options.
 * @throws {@link TypeError} When `array` is not an array, or the worker is not a function.
 * @throws {@link RangeError} When `concurrency` is not a positive integer or `Infinity`.
 */
export function prepareAsyncWork<Item>(
    array: unknown,
    workerName: string,
    worker: unknown,
    options: AsyncWorkOptions,
): { items: readonly Item[]; work: ResolvedAsyncWork } {
    if (!Array.isArray(array)) {
        throw typeError("array", "an array", array);
    }
    assertFunction(workerName, worker);
    const concurrency =
        assertConcurrency("concurrency", options.concurrency) ??
        Number.POSITIVE_INFINITY;
    if (
        options.stopOnError !== undefined &&
        typeof options.stopOnError !== "boolean"
    ) {
        throw typeError("stopOnError", "a boolean", options.stopOnError);
    }
    return {
        items: array as readonly Item[],
        work: {
            concurrency,
            signal: options.signal,
            stopOnError: options.stopOnError ?? true,
        },
    };
}

/**
 * Outcome of one item, in input order.
 */
export type WorkerOutcome<Result> =
    | { status: "fulfilled"; value: Result }
    | { status: "rejected"; reason: unknown };

/**
 * Runs `worker` for every item, preserving input order.
 *
 * At most `concurrency` calls are in flight. `Infinity` starts every item.
 * The first rejection rejects the returned promise when `stopOnError` is
 * true. Otherwise rejections are collected and the promise rejects with
 * `AggregateError` after every item settles. An aborted signal rejects with
 * the abort reason and stops starting work. Work that already started is
 * not cancelled.
 *
 * @param items - The source array.
 * @param work - Validated concurrency options.
 * @param worker - Called with the item, its index, and the source array.
 * @returns One outcome per item when every item is collected.
 */
export async function runInPool<Item, Result>(
    items: readonly Item[],
    work: ResolvedAsyncWork,
    worker: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => Result | Promise<Result>,
    settle = false,
): Promise<WorkerOutcome<Result>[]> {
    if (work.signal?.aborted) {
        throw work.signal.reason;
    }
    const outcomes: WorkerOutcome<Result>[] = new Array(items.length);
    if (items.length === 0) {
        return outcomes;
    }

    let nextIndex = 0;
    let inFlight = 0;
    let settledCount = 0;
    let stopped = false;

    return new Promise<WorkerOutcome<Result>[]>((resolve, reject) => {
        const onAbort = (): void => {
            if (stopped) {
                return;
            }
            stopped = true;
            reject(work.signal?.reason);
        };
        work.signal?.addEventListener("abort", onAbort, { once: true });

        const finish = (): void => {
            if (stopped) {
                return;
            }
            stopped = true;
            work.signal?.removeEventListener("abort", onAbort);
            if (settle) {
                resolve(outcomes);
                return;
            }
            if (!work.stopOnError) {
                const reasons: unknown[] = [];
                for (const outcome of outcomes) {
                    if (outcome?.status === "rejected") {
                        reasons.push(outcome.reason);
                    }
                }
                if (reasons.length > 0) {
                    reject(
                        new AggregateError(
                            reasons,
                            `${reasons.length} async ${reasons.length === 1 ? "operation" : "operations"} failed.`,
                        ),
                    );
                    return;
                }
            }
            resolve(outcomes);
        };

        const launch = (): void => {
            if (stopped || work.signal?.aborted) {
                if (work.signal?.aborted) {
                    onAbort();
                }
                return;
            }
            while (inFlight < work.concurrency && nextIndex < items.length) {
                const index = nextIndex;
                nextIndex += 1;
                inFlight += 1;
                Promise.resolve()
                    .then(() => worker(items[index] as Item, index, items))
                    .then(
                        (value) => {
                            outcomes[index] = { status: "fulfilled", value };
                        },
                        (reason: unknown) => {
                            outcomes[index] = { status: "rejected", reason };
                            if (work.stopOnError && !settle && !stopped) {
                                stopped = true;
                                work.signal?.removeEventListener(
                                    "abort",
                                    onAbort,
                                );
                                reject(reason);
                            }
                        },
                    )
                    .finally(() => {
                        inFlight -= 1;
                        settledCount += 1;
                        if (stopped) {
                            return;
                        }
                        if (settledCount === items.length) {
                            finish();
                            return;
                        }
                        launch();
                    });
            }
        };

        launch();
    });
}

/**
 * Values from outcomes, in order.
 *
 * Call this only after a run that rejected failures itself.
 *
 * @param outcomes - Settled outcomes.
 * @returns The fulfilled values.
 */
export function fulfilledValues<Result>(
    outcomes: readonly WorkerOutcome<Result>[],
): Result[] {
    const values: Result[] = [];
    for (const outcome of outcomes) {
        if (outcome?.status === "fulfilled") {
            values.push(outcome.value);
        }
    }
    return values;
}
