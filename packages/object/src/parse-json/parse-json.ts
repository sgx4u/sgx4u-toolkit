import {
    createDictionary,
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { JSONReviver, ParseJSONParams } from "./parse-json.types.js";

const parseFields = ["text", "reviver"] as const;

interface ParsedArguments {
    reviver: JSONReviver | undefined;
    text: unknown;
}

/**
 * Parses JSON text and drops `__proto__`, `prototype`, and `constructor`.
 *
 * Pass a string, or `{ text, reviver }`. Invalid JSON and a non-string
 * `text` return `undefined`. A reviver still cannot keep a dangerous key.
 * The reviver runs inside `JSON.parse`, and a final walk drops dangerous
 * keys a reviver may have built itself.
 *
 * @param text - JSON text.
 * @returns The parsed value, or `undefined` when the text is not JSON.
 * @example
 * parseJSON('{"id":1}');
 */
export function parseJSON(text: string): unknown;
/**
 * @param params - The text and an optional reviver.
 * @throws {TypeError} When `reviver` is present and is not a function.
 */
export function parseJSON(params: ParseJSONParams): unknown;
/**
 * @param text - A value that is not JSON text. Non-strings return `undefined`.
 */
export function parseJSON(text: unknown): unknown;
/**
 * @param textOrParams - JSON text or the options object.
 */
export function parseJSON(textOrParams: unknown): unknown {
    const resolved = resolveParse(textOrParams);
    if (resolved === undefined || typeof resolved.text !== "string") {
        return undefined;
    }
    try {
        const parsed: unknown = JSON.parse(
            resolved.text,
            function revive(
                this: unknown,
                key: string,
                value: unknown,
            ): unknown {
                const revived = callReviver(resolved.reviver, this, key, value);
                if (isDangerousKey(key)) {
                    return undefined;
                }
                return revived;
            },
        );
        return dropDangerous(parsed, new WeakMap());
    } catch (error) {
        if (error instanceof SyntaxError) {
            return undefined;
        }
        throw error;
    }
}

/**
 * Reads the string form or the options form.
 *
 * @param textOrParams - The argument passed to `parseJSON`.
 * @returns The text and reviver, or `undefined` when the argument is neither.
 * @throws {TypeError} When `reviver` is present and is not a function.
 */
function resolveParse(textOrParams: unknown): ParsedArguments | undefined {
    if (typeof textOrParams === "string") {
        return { reviver: undefined, text: textOrParams };
    }
    if (!isParameterRecord(textOrParams, "text", parseFields)) {
        return undefined;
    }
    return {
        reviver: readReviver(textOrParams.reviver),
        text: textOrParams.text,
    };
}

/**
 * Reads `reviver` from the options object.
 *
 * An omitted reviver is `undefined`. Any other non-function throws.
 *
 * @param reviver - The option value. It may be absent.
 * @returns The reviver, or `undefined` when it was omitted.
 * @throws {TypeError} When `reviver` is present and is not a function.
 */
function readReviver(reviver: unknown): JSONReviver | undefined {
    if (reviver === undefined) {
        return undefined;
    }
    assertFunction(reviver, "reviver");
    return reviver as JSONReviver;
}

/**
 * Calls the user's reviver, or returns `value` when there is none.
 *
 * @param reviver - The user's reviver.
 * @param holder - The `this` value `JSON.parse` provides.
 * @param key - The current key. The root key is `""`.
 * @param value - The current value.
 * @returns The value to store.
 */
function callReviver(
    reviver: JSONReviver | undefined,
    holder: unknown,
    key: string,
    value: unknown,
): unknown {
    if (reviver === undefined) {
        return value;
    }
    return reviver.call(holder, key, value);
}

/**
 * Copies plain objects and arrays that contain a dangerous key.
 *
 * Objects with no dangerous key keep their references. Cycles point at the
 * copy that is already being built.
 *
 * @param value - The current value.
 * @param copies - Values already visited, mapped to the value that replaced them.
 * @returns A value with dangerous keys removed.
 */
function dropDangerous(
    value: unknown,
    copies: WeakMap<object, unknown>,
): unknown {
    if (Array.isArray(value)) {
        return dropDangerousArray(value, copies);
    }
    if (!isPlainObjectValue(value)) {
        return value;
    }
    const existing = copies.get(value);
    if (existing !== undefined) {
        return existing;
    }
    const copy = createDictionary(value);
    copies.set(value, copy);
    let changed = false;
    for (const key of Object.keys(value)) {
        if (isDangerousKey(key)) {
            changed = true;
            continue;
        }
        const current = readOwnProperty(value, key);
        const next = dropDangerous(current, copies);
        writeOwnProperty(copy, key, next, "skip");
        if (!Object.is(next, current)) {
            changed = true;
        }
    }
    if (!changed) {
        copies.set(value, value);
        return value;
    }
    return copy;
}

/**
 * Drops dangerous keys inside an array's elements.
 *
 * @param value - The source array.
 * @param copies - Values already visited.
 * @returns The same array when nothing changed, otherwise a copy.
 */
function dropDangerousArray(
    value: unknown[],
    copies: WeakMap<object, unknown>,
): unknown {
    const existing = copies.get(value);
    if (existing !== undefined) {
        return existing;
    }
    const copy: unknown[] = [];
    copies.set(value, copy);
    let changed = false;
    for (let index = 0; index < value.length; index += 1) {
        if (!Object.hasOwn(value, index)) {
            continue;
        }
        const current = value[index];
        const next = dropDangerous(current, copies);
        copy[index] = next;
        if (!Object.is(next, current)) {
            changed = true;
        }
    }
    if (!changed) {
        copies.set(value, value);
        return value;
    }
    return copy;
}
