import type { Predicate } from "../types/predicate.types.js";
import { assertPredicates } from "../utils/assert-predicates.utils.js";

/**
 * Returns a predicate that is true when exactly one predicate is true.
 *
 * An empty list returns a predicate that is always `false`. Evaluation can
 * stop once a second predicate returns `true`. If a predicate throws, that
 * exception propagates. The input list is not copied or mutated.
 *
 * @typeParam Value - The value each predicate receives.
 * @param predicates - Predicates applied from left to right.
 * @returns A new predicate.
 * @throws {TypeError} When `predicates` is not an array, or any entry is not a function.
 * @example
 * exactlyOnePass([(value: number) => value > 0, (value: number) => value > 10])(4); // true
 */
export function exactlyOnePass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value> {
    assertPredicates(predicates, "exactlyOnePass");
    return (value: Value): boolean => {
        let matches = 0;
        for (const predicate of predicates) {
            if (!predicate(value)) {
                continue;
            }
            matches += 1;
            if (matches > 1) {
                return false;
            }
        }
        return matches === 1;
    };
}
