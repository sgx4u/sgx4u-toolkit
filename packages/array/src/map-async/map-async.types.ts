/**
 * Arguments for {@link mapAsync}.
 */
export interface MapAsyncParams<Item, Result> {
    /** Items to map. The array is not mutated. */
    array: readonly Item[];
    /**
     * Maps one item to a result. It may return a promise.
     */
    mapper: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => Result | Promise<Result>;
    /**
     * Maximum number of mapper calls in flight.
     *
     * A positive integer, or `Infinity`.
     * @defaultValue Infinity
     */
    concurrency?: number;
    /**
     * Aborts before new work starts.
     *
     * An already-aborted signal rejects with `signal.reason`.
     */
    signal?: AbortSignal;
    /**
     * When true, the first mapper failure rejects the promise.
     *
     * When false, every item runs and the promise rejects with
     * `AggregateError` if any mapper failed.
     * @defaultValue true
     */
    stopOnError?: boolean;
}
