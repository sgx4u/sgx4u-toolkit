/**
 * Arguments for {@link flatMapAsync}.
 */
export interface FlatMapAsyncParams<Item, Result> {
    /** Items to map. The array is not mutated. */
    array: readonly Item[];
    /**
     * Maps one item to a result or a list of results. It may return a promise.
     *
     * A non-array result is one item. An array is flattened one level.
     */
    mapper: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => Result | readonly Result[] | Promise<Result | readonly Result[]>;
    /**
     * Maximum number of mapper calls in flight.
     * @defaultValue Infinity
     */
    concurrency?: number;
    /** Aborts before new work starts. */
    signal?: AbortSignal;
    /**
     * When true, the first mapper failure rejects the promise.
     * @defaultValue true
     */
    stopOnError?: boolean;
}
