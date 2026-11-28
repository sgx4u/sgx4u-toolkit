/**
 * Arguments for {@link reduceAsync}.
 */
export interface ReduceAsyncParams<Item, Result> {
    /** Items to reduce. The array is not mutated. */
    array: readonly Item[];
    /**
     * Combines the accumulator with one item. It may return a promise.
     *
     * Each step waits for the previous step. There is no concurrency limit.
     */
    reducer: (
        accumulator: Result,
        item: Item,
        index: number,
        array: readonly Item[],
    ) => Result | Promise<Result>;
    /**
     * The accumulator for the first item.
     *
     * Required, including for an empty array. An empty array resolves to
     * this value.
     */
    initialValue: Result;
    /**
     * Checked before the reduction starts and before each item.
     *
     * An aborted signal rejects with `signal.reason`.
     */
    signal?: AbortSignal;
}
