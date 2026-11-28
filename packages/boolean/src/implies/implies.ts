import { describeReceived } from "../utils/describe-received.utils.js";
import type { ImpliesInput } from "./implies.types.js";

/**
 * Reports whether `antecedent` implies `consequent`.
 *
 * The result is `!antecedent || consequent`. Either value not being a
 * primitive boolean returns `undefined`. The call takes one flat object.
 *
 * @param input - `antecedent` and `consequent`.
 * @returns The implication, or `undefined` when either value is not a primitive boolean.
 * @throws {TypeError} When `input` is not a non-null object.
 * @example
 * implies({ antecedent: false, consequent: false }); // true
 */
export function implies(input: ImpliesInput): boolean | undefined {
    if (typeof input !== "object" || input === null) {
        throw new TypeError(
            `implies requires an object. Received ${describeReceived(input)}.`,
        );
    }
    if (
        typeof input.antecedent !== "boolean" ||
        typeof input.consequent !== "boolean"
    ) {
        return undefined;
    }
    return !input.antecedent || input.consequent;
}
