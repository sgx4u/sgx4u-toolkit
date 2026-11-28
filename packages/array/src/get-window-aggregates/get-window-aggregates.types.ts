/**
 * Named aggregates computed from finite numbers in a window.
 */
export type WindowAggregateName = "sum" | "mean" | "min" | "max";

/**
 * Arguments for {@link getWindowAggregates}.
 */
export interface GetWindowAggregatesParams<Item, Result> {
    /** Items to window. The array is not mutated. */
    array: readonly Item[];
    /**
     * Maximum number of items in one window.
     *
     * A positive integer.
     */
    size: number;
    /**
     * How far the next window starts after the previous start.
     * @defaultValue 1
     */
    step?: number;
    /**
     * A named numeric aggregate, or a function of the window's items.
     *
     * Named aggregates require finite numbers. A function receives the items
     * as they are.
     */
    aggregate: WindowAggregateName | ((items: Item[]) => Result);
    /**
     * When true, a short window at the end is kept.
     *
     * When false, a window shorter than `size` is dropped.
     * @defaultValue true
     */
    partial?: boolean;
}
