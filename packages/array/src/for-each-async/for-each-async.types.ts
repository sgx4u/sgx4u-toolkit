/**
 * Arguments for {@link forEachAsync}.
 */
export interface ForEachAsyncParams<Item> {
    /** Items to visit. The array is not mutated. */
    array: readonly Item[];
    /**
     * Visits one item. It may return a promise. The result is ignored.
     */
    visitor: (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => unknown | Promise<unknown>;
    /**
     * Maximum number of visits in flight.
     * @defaultValue Infinity
     */
    concurrency?: number;
    /** Aborts before new work starts. */
    signal?: AbortSignal;
    /**
     * When true, the first visitor failure rejects the promise.
     * @defaultValue true
     */
    stopOnError?: boolean;
}
