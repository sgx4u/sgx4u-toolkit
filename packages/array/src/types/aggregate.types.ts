/**
 * One sliding window and the value computed from its items.
 *
 * `start` is the index of the first item. `end` is the index one past the
 * last item, so the window is `items` from `start` inclusive to `end`
 * exclusive.
 */
export interface WindowAggregate<Item, Result> {
    start: number;
    end: number;
    items: Item[];
    value: Result;
}

/**
 * One histogram bin.
 *
 * Every bin except the last is half-open: `start <= value < end`. The last
 * bin is closed on the right: `start <= value <= end`.
 */
export interface HistogramBin<Item> {
    start: number;
    end: number;
    count: number;
    items: Item[];
}
