import type { Predicate } from "../types/predicate.types.js";
import { assertPredicates } from "../utils/assert-predicates.utils.js";

/**
 * Returns a predicate that is true when no predicate is true.
 *
 * An empty list returns a predicate that is always `true`. Evaluation stops
 * at the first `true`. If a predicate throws, that exception propagates.
 * The input list is not copied or mutated.
 *
 * @typeParam Value - The value each predicate receives.
 * @param predicates - Predicates applied from left to right.
 * @returns A new predicate.
 * @throws {TypeError} When `predicates` is not an array, or any entry is not a function.
 * @example
 * nonePass([(value: number) => value < 0])(4); // true
 */
export function nonePass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value> {
    assertPredicates(predicates, "nonePass");
    return (value: Value): boolean => {
        for (const predicate of predicates) {
            if (predicate(value)) {
                return false;
            }
        }
        return true;
    };
}
