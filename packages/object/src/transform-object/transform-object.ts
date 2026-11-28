import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { TransformObjectParams } from "./transform-object.types.js";

/**
 * Reduces the own enumerable string keys of a plain object.
 *
 * `transformer` is called in insertion order. The accumulator is not copied.
 * A value that is not a plain object returns `undefined`. The input object
 * is not mutated.
 *
 * @typeParam A - The accumulator type.
 * @param params - The object, the transformer, and the initial accumulator.
 * @returns The final accumulator, or `undefined` when `object` is not plain.
 * @throws {TypeError} When `transformer` is not a function.
 * @example
 * transformObject({
 *     initial: 0,
 *     object: { a: 1, b: 2 },
 *     transformer: (sum, value) => sum + Number(value),
 * });
 */
export function transformObject<A>(
    params: TransformObjectParams<A>,
): A | undefined {
    assertFunction(params.transformer, "transformer");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    let accumulator = params.initial;
    for (const key of Object.keys(params.object)) {
        accumulator = params.transformer(
            accumulator,
            readOwnProperty(params.object, key),
            key,
            params.object,
        );
    }
    return accumulator;
}
