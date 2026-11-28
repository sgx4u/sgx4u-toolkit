/**
 * Arguments for {@link someAsync}.
 */
export interface SomeAsyncParams<Item> {
    /** Items to test. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reports whether an item counts. It may return a promise.
     */
    predicate: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => boolean | Promise<boolean>;
    /**
     * Maximum number of predicate calls in flight.
     * @defaultValue Infinity
     */
    concurrency?: number;
    /** Aborts before new work starts. */
    signal?: AbortSignal;
    /**
     * When true, the first predicate failure rejects the promise.
     * @defaultValue true
     */
    stopOnError?: boolean;
}
