import {
    circularValues,
    prototypeKeyValues,
    prototypePolicyValues,
} from "../constants/object-options.constants.js";
import { cloneDeepValue } from "../utils/clone.utils.js";
import type { CloneDeepOptions } from "../utils/clone.utils.js";
import { readChoice } from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";

const cloneDeepFields = [
    "value",
    "circular",
    "prototypes",
    "prototypeKeys",
] as const;

/**
 * Deep-copies `value`.
 *
 * Pass a value, or `{ value, circular, prototypes, prototypeKeys }`. The
 * object form is recognized with `isParameterRecord` when the argument owns
 * `value` and its own string keys are only that allowed set. To copy an
 * object that has exactly those keys, give it another own key, or pass it
 * as the `value` of an options object. Calls `cloneDeepValue`. The input is
 * not mutated.
 *
 * @param value - The value to copy, or the options object.
 * @returns The copy.
 * @throws {RangeError} When `circular`, `prototypes`, or `prototypeKeys` is unknown, or when `circular` is `"throw"` and `cloneDeepValue` finds a cycle.
 * @example
 * cloneDeep({ a: { b: 1 } });
 */
export function cloneDeep(value: unknown): unknown {
    if (isParameterRecord(value, "value", cloneDeepFields)) {
        return cloneDeepValue(value.value, readCloneOptions(value));
    }
    return cloneDeepValue(value, {
        circular: "preserve",
        prototypeKeys: "skip",
        prototypes: "strip",
    });
}

/**
 * Reads the clone policies from an options object.
 *
 * @param params - An object already known to be the options form.
 * @returns Policies for `cloneDeepValue`.
 * @throws {RangeError} When a policy is not one of the known values.
 */
function readCloneOptions(params: Record<string, unknown>): CloneDeepOptions {
    return {
        circular: readChoice(
            params.circular,
            "circular",
            circularValues,
            "preserve",
        ),
        prototypeKeys: readChoice(
            params.prototypeKeys,
            "prototypeKeys",
            prototypeKeyValues,
            "skip",
        ),
        prototypes: readChoice(
            params.prototypes,
            "prototypes",
            prototypePolicyValues,
            "strip",
        ),
    };
}
