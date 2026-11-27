import { circularMarker } from "../constants/object-options.constants.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { readChoice } from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isObjectLikeValue, valueTag } from "../utils/value-kind.utils.js";
import type {
    StringifyCircular,
    StringifyJSONParams,
} from "./stringify-json.types.js";

const stringifyFields = ["value", "space", "stable", "circular"] as const;

const stringifyCircularValues: readonly StringifyCircular[] = [
    "throw",
    "skip",
    "replace",
];

interface JsonWrite {
    circular: StringifyCircular;
    gap: string;
    stable: boolean;
}

interface ResolvedStringify {
    circular: unknown;
    space: unknown;
    stable: boolean;
    value: unknown;
}

/**
 * Stringifies a value with `JSON.stringify` rules.
 *
 * Pass a value, or `{ value, space, stable, circular }`. `undefined`, a
 * function, a symbol, or a bigint at the root returns `undefined`. Nested
 * bigints still throw `TypeError`. `stable` sorts object keys by UTF-16 code
 * unit order. A cycle throws `RangeError` unless `circular` says otherwise.
 *
 * @param value - The value to stringify.
 * @returns JSON text, or `undefined` when the root has no JSON form.
 * @example
 * stringifyJSON({ id: 1 });
 */
/**
 * @param params - The value and the stringify options.
 * @throws {RangeError} When `circular` is not `"throw"`, `"skip"`, or `"replace"`, or when a cycle is rejected.
 * @throws {TypeError} When a nested bigint is serialized.
 */
export function stringifyJSON(params: StringifyJSONParams): string | undefined;
/**
 * @param value - The value to stringify.
 */
export function stringifyJSON(value: unknown): string | undefined;
/**
 * @param valueOrParams - A value or the options object.
 */
export function stringifyJSON(valueOrParams: unknown): string | undefined {
    const resolved = resolveStringify(valueOrParams);
    if (isOmittedRoot(resolved.value)) {
        return undefined;
    }
    const writer: JsonWrite = {
        circular: readChoice(
            resolved.circular,
            "circular",
            stringifyCircularValues,
            "throw",
        ),
        gap: resolveGap(resolved.space),
        stable: resolved.stable,
    };
    return encode(resolved.value, "", "", new Set(), false, writer);
}

/**
 * Reads a bare value or the options object.
 *
 * @param valueOrParams - The argument passed to `stringifyJSON`.
 * @returns The value and the options that apply to it.
 */
function resolveStringify(valueOrParams: unknown): ResolvedStringify {
    if (isParameterRecord(valueOrParams, "value", stringifyFields)) {
        return {
            circular: valueOrParams.circular,
            space: valueOrParams.space,
            stable: valueOrParams.stable === true,
            value: valueOrParams.value,
        };
    }
    return {
        circular: undefined,
        space: undefined,
        stable: false,
        value: valueOrParams,
    };
}

/**
 * Whether a root value has no JSON text.
 *
 * @param value - The root value.
 * @returns `true` for `undefined`, a function, a symbol, or a bigint.
 */
function isOmittedRoot(value: unknown): boolean {
    const valueType = typeof value;
    return (
        valueType === "undefined" ||
        valueType === "function" ||
        valueType === "symbol" ||
        valueType === "bigint"
    );
}

/**
 * Turns `space` into the indent `JSON.stringify` would use.
 *
 * @param space - The caller's space option.
 * @returns The indent text. Empty when there is no indent.
 */
function resolveGap(space: unknown): string {
    if (typeof space === "number") {
        if (!Number.isFinite(space)) {
            return space > 0 ? " ".repeat(10) : "";
        }
        const count = Math.trunc(space);
        if (count <= 0) {
            return "";
        }
        return " ".repeat(Math.min(count, 10));
    }
    if (typeof space === "string") {
        return space.slice(0, 10);
    }
    return "";
}

/**
 * Serializes one value to JSON text.
 *
 * `undefined` means the value is omitted. Callers that are building an array
 * turn that into `null`.
 *
 * @param value - The current value.
 * @param key - The property name or index string. The root key is `""`.
 * @param indent - The indent of this value's container.
 * @param ancestors - Objects on the path from the root.
 * @param ignoreToJSON - When true, `toJSON` is not called for this object.
 * @param writer - Stringify options.
 * @returns JSON text, or `undefined` when the value is omitted.
 * @throws {RangeError} When a cycle is rejected.
 * @throws {TypeError} When a bigint is serialized.
 */
function encode(
    value: unknown,
    key: string,
    indent: string,
    ancestors: Set<object>,
    ignoreToJSON: boolean,
    writer: JsonWrite,
): string | undefined {
    if (!ignoreToJSON && isObjectLikeValue(value)) {
        const toJSON = readToJSON(value);
        if (toJSON !== undefined) {
            const next = toJSON.call(value, key);
            if (next !== value) {
                return encode(next, key, indent, ancestors, false, writer);
            }
            return encode(value, key, indent, ancestors, true, writer);
        }
    }
    if (value === null) {
        return "null";
    }
    const valueType = typeof value;
    if (
        valueType === "string" ||
        valueType === "number" ||
        valueType === "boolean"
    ) {
        return JSON.stringify(value);
    }
    if (valueType === "bigint") {
        throw new TypeError("Do not know how to serialize a BigInt");
    }
    if (
        valueType === "undefined" ||
        valueType === "function" ||
        valueType === "symbol"
    ) {
        return undefined;
    }
    if (!isObjectLikeValue(value)) {
        return undefined;
    }
    const unboxed = unboxedPrimitive(value);
    if (unboxed !== undefined) {
        return encode(unboxed, key, indent, ancestors, true, writer);
    }
    if (ancestors.has(value)) {
        return circularText(writer.circular);
    }
    ancestors.add(value);
    try {
        if (Array.isArray(value)) {
            return encodeArray(value, indent, ancestors, writer);
        }
        return encodeObject(value, indent, ancestors, writer);
    } finally {
        ancestors.delete(value);
    }
}

/**
 * Serializes an array.
 *
 * Holes, `undefined`, functions, and symbols become `null`.
 *
 * @param value - The array.
 * @param indent - The indent of the array.
 * @param ancestors - Objects on the path from the root. `value` is included.
 * @param writer - Stringify options.
 * @returns JSON array text.
 */
function encodeArray(
    value: unknown[],
    indent: string,
    ancestors: Set<object>,
    writer: JsonWrite,
): string {
    const childIndent = writer.gap.length === 0 ? "" : indent + writer.gap;
    const parts: string[] = [];
    for (let index = 0; index < value.length; index += 1) {
        const current = Object.hasOwn(value, index) ? value[index] : undefined;
        const encoded = encode(
            current,
            String(index),
            childIndent,
            ancestors,
            false,
            writer,
        );
        const rendered = encoded === undefined ? "null" : encoded;
        parts.push(
            writer.gap.length === 0 ? rendered : `${childIndent}${rendered}`,
        );
    }
    if (parts.length === 0) {
        return "[]";
    }
    if (writer.gap.length === 0) {
        return `[${parts.join(",")}]`;
    }
    return `[\n${parts.join(",\n")}\n${indent}]`;
}

/**
 * Serializes an object's own enumerable string keys.
 *
 * @param value - The object.
 * @param indent - The indent of the object.
 * @param ancestors - Objects on the path from the root. `value` is included.
 * @param writer - Stringify options.
 * @returns JSON object text.
 */
function encodeObject(
    value: object,
    indent: string,
    ancestors: Set<object>,
    writer: JsonWrite,
): string {
    const keys = Object.keys(value);
    if (writer.stable) {
        keys.sort();
    }
    const childIndent = writer.gap.length === 0 ? "" : indent + writer.gap;
    const parts: string[] = [];
    for (const key of keys) {
        const encoded = encode(
            readOwnProperty(value, key),
            key,
            childIndent,
            ancestors,
            false,
            writer,
        );
        if (encoded === undefined) {
            continue;
        }
        const rendered = `${JSON.stringify(key)}:${writer.gap.length === 0 ? "" : " "}${encoded}`;
        parts.push(
            writer.gap.length === 0 ? rendered : `${childIndent}${rendered}`,
        );
    }
    if (parts.length === 0) {
        return "{}";
    }
    if (writer.gap.length === 0) {
        return `{${parts.join(",")}}`;
    }
    return `{\n${parts.join(",\n")}\n${indent}}`;
}

/**
 * The JSON text used for a cycle, or `undefined` when the key is omitted.
 *
 * @param circular - The cycle policy.
 * @returns JSON text, or `undefined` for `"skip"`.
 * @throws {RangeError} When `circular` is `"throw"`.
 */
function circularText(circular: StringifyCircular): string | undefined {
    if (circular === "throw") {
        throw new RangeError(
            "`circular` blocked a cycle. The value points at an ancestor.",
        );
    }
    if (circular === "replace") {
        return JSON.stringify(circularMarker);
    }
    return undefined;
}

/**
 * Reads `toJSON` when the object has a function by that name.
 *
 * @param value - An object.
 * @returns The method, or `undefined` when it is missing.
 */
function readToJSON(
    value: object,
): ((this: object, key: string) => unknown) | undefined {
    if (!Object.hasOwn(value, "toJSON") && !("toJSON" in value)) {
        return undefined;
    }
    const candidate = (value as { toJSON?: unknown }).toJSON;
    if (typeof candidate !== "function") {
        return undefined;
    }
    return candidate as (this: object, key: string) => unknown;
}

/**
 * Unwraps a boxed string, number, or boolean.
 *
 * @param value - An object.
 * @returns The primitive, or `undefined` when `value` is not boxed.
 */
function unboxedPrimitive(
    value: object,
): string | number | boolean | undefined {
    const tag = valueTag(value);
    if (tag === "[object Number]") {
        return Number(value);
    }
    if (tag === "[object String]") {
        return String(value);
    }
    if (tag === "[object Boolean]") {
        const primitive = (value as { valueOf(): unknown }).valueOf();
        return primitive === true;
    }
    return undefined;
}
