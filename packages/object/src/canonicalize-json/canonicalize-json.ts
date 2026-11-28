import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

/**
 * Serializes `value` with RFC 8785 canonical JSON.
 *
 * Object keys are sorted by UTF-16 code units, which is JavaScript's default
 * string sort. There is no whitespace. Strings and finite numbers use
 * `JSON.stringify`, so `-0` becomes `0`. Arrays keep their order and are
 * joined with commas.
 *
 * The result is `undefined` when `value` is not JSON: a cycle, a hole,
 * `undefined`, a function, a symbol, a bigint, `NaN`, an infinity, a symbol
 * key, or an object that is not a plain object or an array. `toJSON` is not
 * called. `undefined` object properties are not dropped; they make the value
 * non-JSON.
 *
 * @param value - Any value.
 * @returns The canonical JSON text, or `undefined` when `value` is not JSON.
 * @example
 * canonicalizeJSON({ b: 1, a: 2 });
 */
export function canonicalizeJSON(value: unknown): string | undefined {
    return writeValue(value, new Set());
}

/**
 * Writes one JSON node.
 *
 * Ancestors are removed after the node so a later sibling may point at it.
 * A cycle returns `undefined`.
 *
 * @param value - The current value.
 * @param ancestors - Objects currently on the path.
 * @returns The canonical text, or `undefined` when this node is not JSON.
 */
function writeValue(
    value: unknown,
    ancestors: Set<object>,
): string | undefined {
    if (value === null) {
        return "null";
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        return JSON.stringify(value);
    }
    if (typeof value !== "object") {
        return undefined;
    }
    if (
        ancestors.has(value) ||
        Object.getOwnPropertySymbols(value).length > 0
    ) {
        return undefined;
    }
    ancestors.add(value);
    const text = Array.isArray(value)
        ? writeArray(value, ancestors)
        : isPlainObjectValue(value)
          ? writeObject(value, ancestors)
          : undefined;
    ancestors.delete(value);
    return text;
}

/**
 * Writes a JSON array.
 *
 * A hole or a non-JSON element rejects the array.
 *
 * @param value - The array.
 * @param ancestors - Objects currently on the path.
 * @returns The canonical array text, or `undefined`.
 */
function writeArray(
    value: readonly unknown[],
    ancestors: Set<object>,
): string | undefined {
    const parts: string[] = [];
    for (let index = 0; index < value.length; index += 1) {
        if (!Object.hasOwn(value, index)) {
            return undefined;
        }
        const part = writeValue(value[index], ancestors);
        if (part === undefined) {
            return undefined;
        }
        parts.push(part);
    }
    return `[${parts.join(",")}]`;
}

/**
 * Writes a JSON object with keys sorted by UTF-16 code units.
 *
 * @param value - The plain object.
 * @param ancestors - Objects currently on the path.
 * @returns The canonical object text, or `undefined` when a property is not JSON.
 */
function writeObject(
    value: object,
    ancestors: Set<object>,
): string | undefined {
    const parts: string[] = [];
    for (const key of Object.keys(value).sort()) {
        const part = writeValue(readOwnProperty(value, key), ancestors);
        if (part === undefined) {
            return undefined;
        }
        parts.push(`${JSON.stringify(key)}:${part}`);
    }
    return `{${parts.join(",")}}`;
}
