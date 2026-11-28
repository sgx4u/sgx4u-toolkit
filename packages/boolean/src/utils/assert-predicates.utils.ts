import type { Predicate } from "../types/predicate.types.js";
import { describeReceived } from "./describe-received.utils.js";

/**
 * Checks that `predicates` is an array of functions.
 *
 * The array is not copied. A later call of the returned predicate uses the
 * same functions. A bad entry throws here, not when that predicate runs.
 *
 * @param predicates - The argument the combinator received.
 * @param functionName - Public name written into the type error.
 * @throws {TypeError} When `predicates` is not an array, or any entry is not a function.
 */
export function assertPredicates(
    predicates: unknown,
    functionName: string,
): asserts predicates is readonly Predicate<unknown>[] {
    if (!Array.isArray(predicates)) {
        throw new TypeError(
            `${functionName} requires an array of functions. Received ${describeReceived(predicates)}.`,
        );
    }
    for (let index = 0; index < predicates.length; index += 1) {
        const entry = predicates[index];
        if (typeof entry !== "function") {
            throw new TypeError(
                `${functionName} requires every entry to be a function. Entry ${index} is ${describeReceived(entry)}.`,
            );
        }
    }
}
