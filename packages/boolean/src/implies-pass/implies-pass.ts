import type { Predicate } from "../types/predicate.types.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import type { ImpliesPassInput } from "./implies-pass.types.js";

/**
 * Returns a predicate for `!antecedent(value) || consequent(value)`.
 *
 * `consequent` is not called when `antecedent` returns `false`. If either
 * predicate throws, that exception propagates. The call takes one flat
 * object.
 *
 * @typeParam Value - The value both predicates receive.
 * @param input - `antecedent` and `consequent`.
 * @returns A new predicate.
 * @throws {TypeError} When `input` is not a non-null object, or either property is not a function.
 * @example
 * impliesPass({
 *     antecedent: (value: number) => value > 0,
 *     consequent: (value: number) => value < 10,
 * })(4); // true
 */
export function impliesPass<Value>(
    input: ImpliesPassInput<Value>,
): Predicate<Value> {
    if (typeof input !== "object" || input === null) {
        throw new TypeError(
            `impliesPass requires an object. Received ${describeReceived(input)}.`,
        );
    }
    if (typeof input.antecedent !== "function") {
        throw new TypeError(
            `antecedent must be a function. Received ${describeReceived(input.antecedent)}.`,
        );
    }
    if (typeof input.consequent !== "function") {
        throw new TypeError(
            `consequent must be a function. Received ${describeReceived(input.consequent)}.`,
        );
    }
    const antecedent = input.antecedent;
    const consequent = input.consequent;
    return (value: Value): boolean => {
        if (!antecedent(value)) {
            return true;
        }
        return consequent(value);
    };
}
