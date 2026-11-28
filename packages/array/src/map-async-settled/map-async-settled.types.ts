/**
 * Arguments for {@link mapAsyncSettled}.
 */
export interface MapAsyncSettledParams<Item, Result> {
    /** Items to map. The array is not mutated. */
    array: readonly Item[];
    /**
     * Maps one item to a result. It may return a promise.
     *
     * A rejection becomes a rejected outcome. It does not reject the
     * returned promise.
     */
    mapper: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => Result | Promise<Result>;
    /**
     * Maximum number of mapper calls in flight.
     * @defaultValue Infinity
     */
    concurrency?: number;
    /** Aborts before new work starts. An abort still rejects the promise. */
    signal?: AbortSignal;
    /**
     * Accepted for the shared async options. Mapper failures are captured
     * either way.
     * @defaultValue true
     */
    stopOnError?: boolean;
}
