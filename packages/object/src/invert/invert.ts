import { duplicateValuePolicies } from "../constants/object-options.constants.js";
import type { DuplicateValues } from "./invert.types.js";
import type { InvertResult } from "./invert.types.js";
import type { InvertParams } from "./invert.types.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import {
    createDictionary,
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const invertFields = ["object", "duplicateValues"] as const;

/**
 * Swaps the keys and values of a plain object.
 *
 * Pass the object, or `{ object, duplicateValues }`. The options form is
 * recognized when the argument is a plain object that owns `object` and has
 * no keys outside `object` and `duplicateValues`. A string, number, or symbol
 * value becomes the new key. Every other value is keyed with `String(value)`.
 * The stored value is the original key. `"last"` overwrites, `"first"` keeps
 * the earliest key, `"array"` groups keys, and `"throw"` raises `RangeError`.
 * Dangerous keys such as `"__proto__"` are skipped. The input is not mutated.
 * `null`, primitives, and arrays return `undefined`.
 *
 * @param object - A plain object, or the options object.
 * @returns The inverted object, or `undefined` when the value is not a plain object.
 * @throws {RangeError} When `duplicateValues` is unknown, or when it is `"throw"` and a key repeats.
 * @example
 * invert({ id: "a", name: "b" });
 */
export function invert(
    params: InvertParams & { duplicateValues: "array" },
): Record<string, string[]> | undefined;
/**
 * @param params - The object and a policy other than `"array"`.
 */
export function invert(
    params: InvertParams & { duplicateValues?: "last" | "first" | "throw" },
): Record<string, string> | undefined;
/**
 * @param params - The object and a `duplicateValues` policy.
 */
export function invert(params: InvertParams): InvertResult | undefined;
/**
 * @param object - A plain object inverted with the `"last"` policy.
 */
export function invert(object: object): Record<string, string> | undefined;
/**
 * @param objectOrParams - A plain object or the options object.
 */
export function invert(objectOrParams: unknown): InvertResult | undefined {
    const resolved = resolveInvert(objectOrParams);
    const policy = readChoice(
        resolved.duplicateValues,
        "duplicateValues",
        duplicateValuePolicies,
        "last",
    );
    if (!isPlainObjectValue(resolved.object)) {
        return undefined;
    }
    return invertPlain(resolved.object, policy);
}

/**
 * Reads a bare object or the options object.
 *
 * A bare object always uses the default policy. Validation of that policy
 * happens in the caller.
 *
 * @param objectOrParams - The argument passed to `invert`.
 * @returns The object and the raw policy. The object may still be a non-object.
 */
function resolveInvert(objectOrParams: unknown): InvertParams {
    if (isParameterRecord(objectOrParams, "object", invertFields)) {
        return {
            object: objectOrParams.object,
            ...(objectOrParams.duplicateValues === undefined
                ? {}
                : {
                      duplicateValues:
                          objectOrParams.duplicateValues as DuplicateValues,
                  }),
        };
    }
    return { object: objectOrParams };
}

/**
 * Inverts the own enumerable string keys of `source`.
 *
 * @param source - A plain object.
 * @param policy - How repeated inverted keys are handled.
 * @returns The inverted dictionary. Null-prototype inputs stay null-prototype.
 * @throws {RangeError} When `policy` is `"throw"` and a key repeats.
 */
function invertPlain(
    source: Record<string, unknown>,
    policy: DuplicateValues,
): InvertResult {
    const result = createDictionary(source);
    for (const key of Object.keys(source)) {
        const inverted = invertKey(source[key]);
        if (isDangerousKey(inverted)) {
            continue;
        }
        if (policy === "array") {
            appendGroup(result, inverted, key);
            continue;
        }
        if (Object.hasOwn(result, inverted)) {
            if (policy === "first") {
                continue;
            }
            if (policy === "throw") {
                throw new RangeError(
                    `\`duplicateValues\` is "throw" and ${describeReceived(inverted)} is already used.`,
                );
            }
        }
        writeOwnProperty(result, inverted, key, "skip");
    }
    return result as InvertResult;
}

/**
 * The key used for `value` in the inverted object.
 *
 * @param value - One property value.
 * @returns The value when it is already a property key, otherwise `String(value)`.
 */
function invertKey(value: unknown): PropertyKey {
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "symbol"
    ) {
        return value;
    }
    return String(value);
}

/**
 * Pushes `originalKey` onto the group stored at `key`.
 *
 * @param result - The inverted object. It is mutated.
 * @param key - The group key.
 * @param originalKey - The key from the input.
 */
function appendGroup(
    result: object,
    key: PropertyKey,
    originalKey: string,
): void {
    const existing = readOwnProperty(result, key);
    if (Array.isArray(existing)) {
        existing.push(originalKey);
        return;
    }
    writeOwnProperty(result, key, [originalKey], "skip");
}
