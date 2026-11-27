import type { JSONPatchOperation } from "../types/json-patch.types.js";
import { describeReceived } from "./describe-received.utils.js";
import { isPlainObjectValue } from "./value-kind.utils.js";
import { parseJSONPointerText } from "./path-text.utils.js";

const patchOperations = [
    "add",
    "remove",
    "replace",
    "move",
    "copy",
    "test",
] as const;

/**
 * Why `value` is not an RFC 6902 patch, or `undefined` when it is well formed.
 *
 * The function does not throw.
 *
 * @param value - The candidate patch.
 * @returns An error message, or `undefined` when every operation is well formed.
 */
export function jsonPatchIssue(value: unknown): string | undefined {
    if (!Array.isArray(value)) {
        return `\`patch\` is not an RFC 6902 patch; received ${describeReceived(value)}.`;
    }
    for (let index = 0; index < value.length; index += 1) {
        if (!isOperation(value[index])) {
            return `\`patch[${index}]\` is not an RFC 6902 operation; received ${describeReceived(value[index])}.`;
        }
    }
    return undefined;
}

/**
 * Copies `value` into JSON Patch operations.
 *
 * Call this only after `jsonPatchIssue` has returned `undefined`.
 *
 * @param value - A well-formed patch array.
 * @returns The operations. `from` and `value` are copied only when present.
 */
export function readJSONPatchOperations(
    value: readonly unknown[],
): JSONPatchOperation[] {
    const operations: JSONPatchOperation[] = [];
    for (const item of value) {
        operations.push(toOperation(item));
    }
    return operations;
}

/**
 * Whether one value is a well-formed operation.
 *
 * @param value - The candidate operation.
 * @returns `true` when `op`, `path`, and the fields that operation requires are present.
 */
function isOperation(value: unknown): boolean {
    if (
        !isPlainObjectValue(value) ||
        !isPatchOperation(value.op) ||
        !isPointer(value.path)
    ) {
        return false;
    }
    if (
        (value.op === "add" || value.op === "replace" || value.op === "test") &&
        !Object.hasOwn(value, "value")
    ) {
        return false;
    }
    return (
        (value.op !== "move" && value.op !== "copy") || isPointer(value.from)
    );
}

/**
 * Whether `value` is one of the six operation names.
 *
 * @param value - The `op` field.
 * @returns `true` when `value` is a JSON Patch operation name.
 */
function isPatchOperation(value: unknown): value is JSONPatchOperation["op"] {
    return (
        typeof value === "string" &&
        patchOperations.some((operation) => operation === value)
    );
}

/**
 * Whether `value` is an RFC 6901 pointer.
 *
 * @param value - The `path` or `from` field.
 * @returns `true` when the text is empty or a pointer that starts with `/`.
 */
function isPointer(value: unknown): value is string {
    return (
        typeof value === "string" && parseJSONPointerText(value) !== undefined
    );
}

/**
 * Copies one validated operation.
 *
 * @param value - A well-formed operation object.
 * @returns The operation, without extra fields.
 */
function toOperation(value: unknown): JSONPatchOperation {
    const source = value as Record<string, unknown>;
    const operation: JSONPatchOperation = {
        op: source.op as JSONPatchOperation["op"],
        path: source.path as string,
    };
    if (typeof source.from === "string") {
        operation.from = source.from;
    }
    if (Object.hasOwn(source, "value")) {
        operation.value = source.value;
    }
    return operation;
}
