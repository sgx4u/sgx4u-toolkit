import type { Predicate } from "../types/predicate.types.js";
import { assertPredicates } from "../utils/assert-predicates.utils.js";

/**
 * Returns a predicate that is true when any predicate is true.
 *
 * An empty list returns a predicate that is always `false`. Evaluation stops
 * at the first `true`. If a predicate throws, that exception propagates.
 * The input list is not copied or mutated.
 *
 * @typeParam Value - The value each predicate receives.
 * @param predicates - Predicates applied from left to right.
 * @returns A new predicate.
 * @throws {TypeError} When `predicates` is not an array, or any entry is not a function.
 * @example
 * anyPass([(value: number) => value < 0, (value: number) => value > 10])(12); // true
 */
export function anyPass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value> {
    assertPredicates(predicates, "anyPass");
    return (value: Value): boolean => {
        for (const predicate of predicates) {
            if (predicate(value)) {
                return true;
            }
        }
        return false;
    };
}
