import { sumExact } from "../utils/exact-sum.utils.js";

/**
 * Returns the correctly rounded sum of the exact double values. An empty list is `0`, unlike `Math.sumPrecise`, which returns `-0`. When `Math.sumPrecise` exists it is used for a non-empty list.
 *
 * @example
 * sumPrecise([1e20, 0.1, -1e20]);
 */
export function sumPrecise(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return 0;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
    }
    const math = Math as Math & {
        sumPrecise?: (items: Iterable<number>) => number;
    };
    if (typeof math.sumPrecise === "function") {
        return math.sumPrecise(values);
    }
    return sumExact(values);
}
