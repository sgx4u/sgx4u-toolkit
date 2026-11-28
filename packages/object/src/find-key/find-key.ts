import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { FindKeyParams } from "./find-key.types.js";

/**
 * Returns the first own enumerable string key that matches `predicate`.
 *
 * Keys are tested in insertion order. A truthy predicate result matches.
 * A value that is not a plain object returns `undefined`. The input is not
 * mutated.
 *
 * @param params - The object and the predicate.
 * @returns The matching key, or `undefined` when none matches.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * findKey({
 *     object: { id: 1, name: "Ada" },
 *     predicate: (value) => value === "Ada",
 * });
 */
export function findKey(params: FindKeyParams): string | undefined {
    assertFunction(params.predicate, "predicate");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    for (const key of Object.keys(params.object)) {
        if (
            params.predicate(
                readOwnProperty(params.object, key),
                key,
                params.object,
            )
        ) {
            return key;
        }
    }
    return undefined;
}
