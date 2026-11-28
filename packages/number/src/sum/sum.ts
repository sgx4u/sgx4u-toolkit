import { sumPrecise } from "../sum-precise/sum-precise.js";

/**
 * Sums finite numbers with {@link sumPrecise}. An empty list is `0`.
 *
 * @example
 * sum([1, 2, 3]);
 */
export function sum(values: readonly number[]): number | undefined {
    return sumPrecise(values);
}
