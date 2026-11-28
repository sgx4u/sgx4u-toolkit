import {
    circularValues,
    prototypePolicyValues,
} from "../constants/object-options.constants.js";
import { cloneDeepValue } from "../utils/clone.utils.js";
import type { CloneVisit } from "../utils/clone.utils.js";
import {
    assertFunction,
    readChoice,
} from "../utils/describe-received.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { CloneDeepWithParams } from "./clone-deep-with.types.js";

/**
 * Deep-copies `value`, asking `customizer` at every node.
 *
 * Calls `cloneDeepValue` with `cloneContinue` as `continueSentinel`. When
 * the customizer returns `cloneContinue`, the default clone proceeds. When
 * it returns `undefined`, the clone stores `undefined`. Dangerous keys are
 * skipped. The input is not mutated.
 *
 * @param params - The value, the customizer, and the clone policies.
 * @returns The copy. The root customizer can make this `undefined`.
 * @throws {TypeError} When `customizer` is not a function.
 * @throws {RangeError} When `circular` or `prototypes` is unknown, or when `circular` is `"throw"` and `cloneDeepValue` finds a cycle.
 * @example
 * cloneDeepWith({
 *     value: { n: 1 },
 *     customizer: ({ value }) => (value === 1 ? 2 : cloneContinue),
 * });
 */
export function cloneDeepWith(params: CloneDeepWithParams): unknown {
    const record = isObjectLikeValue(params) ? params : undefined;
    const customizer = readCustomizer(record?.customizer);
    return cloneDeepValue(record?.value, {
        circular: readChoice(
            record?.circular,
            "circular",
            circularValues,
            "preserve",
        ),
        continueSentinel: cloneContinue,
        customizer,
        prototypeKeys: "skip",
        prototypes: readChoice(
            record?.prototypes,
            "prototypes",
            prototypePolicyValues,
            "strip",
        ),
    });
}

/**
 * Returned from a `cloneDeepWith` customizer to keep the default clone.
 *
 * `undefined` is a real clone result. It does not continue.
 */
export const cloneContinue: unique symbol = Symbol("cloneContinue");

/**
 * Requires `customizer` to be a function.
 *
 * @param value - The `customizer` field.
 * @returns The customizer passed to `cloneDeepValue`.
 * @throws {TypeError} When `value` is not a function.
 */
function readCustomizer(value: unknown): (details: CloneVisit) => unknown {
    assertFunction(value, "customizer");
    return value as (details: CloneVisit) => unknown;
}
