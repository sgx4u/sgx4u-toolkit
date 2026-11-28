import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { FindLastKeyParams } from "./find-last-key.types.js";

/**
 * Returns the last own enumerable string key that matches `predicate`.
 *
 * Keys are tested from the end of the insertion order. A truthy predicate
 * result matches. A value that is not a plain object returns `undefined`.
 * The input is not mutated.
 *
 * @param params - The object and the predicate.
 * @returns The matching key, or `undefined` when none matches.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * findLastKey({
 *     object: { a: 1, b: 1, c: 2 },
 *     predicate: (value) => value === 1,
 * });
 */
export function findLastKey(params: FindLastKeyParams): string | undefined {
    assertFunction(params.predicate, "predicate");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    const keys = Object.keys(params.object);
    for (let index = keys.length - 1; index >= 0; index -= 1) {
        const key = keys[index];
        if (key === undefined) {
            continue;
        }
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
