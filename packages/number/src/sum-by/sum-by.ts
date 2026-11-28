import { sum } from "../sum/sum.js";

/**
 * Sums the finite numbers returned by `iteratee`.
 *
 * @example
 * sumBy({ values: [{ n: 1 }, { n: 2 }], iteratee: (item) => item.n });
 */
export function sumBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined {
    return sum(
        parameters.values.map((item, index) =>
            parameters.iteratee(item, index),
        ),
    );
}
