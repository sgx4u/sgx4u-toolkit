import { prototypeKeyValues } from "../constants/object-options.constants.js";
import type { PrototypeKeys } from "../types/object-config.types.js";
import {
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import { cloneJSONData } from "../utils/json-data.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { ApplyJSONMergePatchParams } from "./apply-json-merge-patch.types.js";

/**
 * Applies an RFC 7396 JSON Merge Patch without mutating `object`.
 *
 * A patch that is not a plain object replaces the document with a clone of
 * the patch. A plain-object patch clones the target, or starts from `{}`
 * when the target is not a plain object. `null` removes a key. A plain-object
 * value merges into that key. Any other value is stored as a clone.
 *
 * Dangerous keys follow `prototypeKeys`. `"skip"` does not write them and
 * does not change `Object.prototype`. The inputs are not mutated.
 *
 * @param params - The document, the patch, and the prototype policy.
 * @returns The patched copy.
 * @throws {TypeError} When `params` is not a plain object.
 * @throws {RangeError} When `prototypeKeys` is unknown, or when it is `"throw"` and the patch uses a dangerous key.
 * @example
 * applyJSONMergePatch({ object: { a: 1, b: 2 }, patch: { b: null, c: 3 } });
 */
export function applyJSONMergePatch(
    params: ApplyJSONMergePatchParams,
): unknown {
    if (!isPlainObjectValue(params)) {
        throw new TypeError(
            `\`params\` must be a plain object; received ${describeReceived(params)}.`,
        );
    }
    const prototypeKeys = readChoice(
        params.prototypeKeys,
        "prototypeKeys",
        prototypeKeyValues,
        "skip",
    );
    return mergeValue(params.object, params.patch, prototypeKeys);
}

/**
 * Merges `patch` into `target`.
 *
 * @param target - The current value.
 * @param patch - The merge patch.
 * @param prototypeKeys - How dangerous keys are written.
 * @returns The merged copy.
 * @throws {RangeError} When a dangerous key is rejected.
 */
function mergeValue(
    target: unknown,
    patch: unknown,
    prototypeKeys: PrototypeKeys,
): unknown {
    if (!isPlainObjectValue(patch)) {
        return cloneJSONData(patch);
    }
    const result: Record<string, unknown> = isPlainObjectValue(target)
        ? (cloneJSONData(target) as Record<string, unknown>)
        : {};
    for (const key of Object.keys(patch)) {
        if (isDangerousKey(key)) {
            if (prototypeKeys === "throw") {
                throw new RangeError(
                    `\`prototypeKeys\` blocked the dangerous key "${key}".`,
                );
            }
            if (prototypeKeys === "skip") {
                continue;
            }
        }
        const value = readOwnProperty(patch, key);
        if (value === null) {
            Reflect.deleteProperty(result, key);
            continue;
        }
        if (isPlainObjectValue(value)) {
            const current = Object.hasOwn(result, key)
                ? readOwnProperty(result, key)
                : undefined;
            writeOwnProperty(
                result,
                key,
                mergeValue(current, value, prototypeKeys),
                prototypeKeys,
            );
            continue;
        }
        writeOwnProperty(result, key, cloneJSONData(value), prototypeKeys);
    }
    return result;
}
