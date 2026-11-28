import { mean } from "../mean/mean.js";

/**
 * Returns the mean of the numbers returned by `iteratee`.
 *
 * @example
 * meanBy({ values: [1, 3], iteratee: (item) => item });
 */
export function meanBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined {
    return mean(
        parameters.values.map((item, index) =>
            parameters.iteratee(item, index),
        ),
    );
}
