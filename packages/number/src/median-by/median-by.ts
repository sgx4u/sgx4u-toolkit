import { median } from "../median/median.js";

/**
 * Returns the median of the numbers returned by `iteratee`.
 *
 * @example
 * medianBy({ values: [3, 1, 2], iteratee: (item) => item });
 */
export function medianBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined {
    return median(
        parameters.values.map((item, index) =>
            parameters.iteratee(item, index),
        ),
    );
}
