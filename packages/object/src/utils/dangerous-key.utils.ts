import { dangerousKeyNames } from "../constants/dangerous-keys.constants.js";
import type { PrototypeKeys } from "../types/object-config.types.js";

const dangerousKeyNameSet: ReadonlySet<string> = new Set(dangerousKeyNames);

/**
 * Whether `key` is `__proto__`, `prototype`, or `constructor`.
 *
 * Only string keys are dangerous. A symbol or a number is never dangerous.
 *
 * @param key - A property name or path segment.
 * @returns `true` when writers must apply the prototype policy.
 */
export function isDangerousKey(key: PropertyKey): boolean {
    return typeof key === "string" && dangerousKeyNameSet.has(key);
}

/**
 * Reads an own property without invoking an inherited `__proto__` getter.
 *
 * @param value - The object that owns `key`.
 * @param key - The own property name.
 * @returns The own data value, the getter result, or `undefined`.
 */
export function readOwnProperty(value: object, key: PropertyKey): unknown {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor === undefined) {
        return undefined;
    }
    if ("value" in descriptor) {
        return descriptor.value;
    }
    if (descriptor.get !== undefined) {
        return descriptor.get.call(value);
    }
    return undefined;
}

/**
 * Writes an own enumerable property.
 *
 * Dangerous keys use `Object.defineProperty`, so `"keep"` never assigns
 * through `Object.prototype`. `"skip"` writes nothing. `"throw"` raises
 * `RangeError` and writes nothing.
 *
 * @param target - The object that receives the property. It is mutated.
 * @param key - The property name.
 * @param value - The property value.
 * @param prototypeKeys - The prototype policy.
 * @returns `"written"` when the property was defined, or `"skipped"` when the policy dropped it.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and `key` is dangerous.
 */
export function writeOwnProperty(
    target: object,
    key: PropertyKey,
    value: unknown,
    prototypeKeys: PrototypeKeys,
): "written" | "skipped" {
    if (isDangerousKey(key)) {
        if (prototypeKeys === "skip") {
            return "skipped";
        }
        if (prototypeKeys === "throw") {
            throw new RangeError(
                `\`prototypeKeys\` blocked the dangerous key "${String(key)}".`,
            );
        }
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            value,
            writable: true,
        });
        return "written";
    }
    (target as Record<PropertyKey, unknown>)[key] = value;
    return "written";
}

/**
 * A new dictionary with the same prototype kind as `source`.
 *
 * A null-prototype source produces `Object.create(null)`. Every other source
 * produces an ordinary object. The result has no keys.
 *
 * @param source - The object being copied, or `undefined` for an ordinary object.
 * @returns An empty dictionary.
 */
export function createDictionary(
    source: object | undefined,
): Record<string, unknown> {
    if (source !== undefined && Object.getPrototypeOf(source) === null) {
        return Object.create(null) as Record<string, unknown>;
    }
    return {};
}

/**
 * Copies own enumerable string keys onto a new dictionary.
 *
 * Dangerous keys follow `prototypeKeys`. The input is not mutated.
 *
 * @param source - The object whose keys are copied.
 * @param prototypeKeys - The prototype policy.
 * @returns A new dictionary.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a dangerous key is copied.
 */
export function copyEnumerableProperties(
    source: object,
    prototypeKeys: PrototypeKeys,
): Record<string, unknown> {
    const target = createDictionary(source);
    for (const key of Object.keys(source)) {
        writeOwnProperty(
            target,
            key,
            (source as Record<string, unknown>)[key],
            prototypeKeys,
        );
    }
    return target;
}
