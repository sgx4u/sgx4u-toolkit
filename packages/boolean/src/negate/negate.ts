import type { Predicate } from "../types/predicate.types.js";
import { describeReceived } from "../utils/describe-received.utils.js";

/**
 * Returns a predicate that negates `predicate`.
 *
 * The original function is not mutated. If `predicate` throws, that
 * exception propagates.
 *
 * @typeParam Value - The value the predicate receives.
 * @param predicate - The predicate to invert.
 * @returns A new predicate.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * negate((value: number) => value > 0)(-1); // true
 */
export function negate<Value>(predicate: Predicate<Value>): Predicate<Value> {
    if (typeof predicate !== "function") {
        throw new TypeError(
            `predicate must be a function. Received ${describeReceived(predicate)}.`,
        );
    }
    return (value: Value): boolean => !predicate(value);
}
