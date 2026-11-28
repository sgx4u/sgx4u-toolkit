import type { Predicate } from "../types/predicate.types.js";
import { assertPredicates } from "../utils/assert-predicates.utils.js";

/**
 * Returns a predicate that is true when every predicate is true.
 *
 * An empty list returns a predicate that is always `true`. Evaluation stops
 * at the first `false`. If a predicate throws, that exception propagates.
 * The input list is not copied or mutated.
 *
 * @typeParam Value - The value each predicate receives.
 * @param predicates - Predicates applied from left to right.
 * @returns A new predicate.
 * @throws {TypeError} When `predicates` is not an array, or any entry is not a function.
 * @example
 * allPass([(value: number) => value > 0, (value: number) => value < 10])(4); // true
 */
export function allPass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value> {
    assertPredicates(predicates, "allPass");
    return (value: Value): boolean => {
        for (const predicate of predicates) {
            if (!predicate(value)) {
                return false;
            }
        }
        return true;
    };
}
