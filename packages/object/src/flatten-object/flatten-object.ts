import {
    circularValues,
    defaultPathDelimiter,
} from "../constants/object-options.constants.js";
import type { CircularPolicy } from "../types/object-config.types.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import {
    isDangerousKey,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type {
    FlattenArrays,
    FlattenObjectParams,
} from "./flatten-object.types.js";

const flattenFields = [
    "object",
    "delimiter",
    "maxDepth",
    "arrays",
    "circular",
    "prefix",
] as const;

const flattenArrayValues = ["index", "keep"] as const;

interface FlattenState {
    delimiter: string;
    maxDepth: number;
    arrays: FlattenArrays;
    circular: CircularPolicy;
    result: Record<string, unknown>;
}

/**
 * Flattens a plain object or array into a record of leaf values.
 *
 * Keys are joined with `delimiter`. Array indexes are decimal strings when
 * `arrays` is `"index"`. `"keep"` stores each array as a value. Depth counts
 * edges. The value at the current prefix is stored when another edge would
 * pass `maxDepth`. An empty container at the root returns `{}`. A nested
 * empty plain object or empty array is stored as a value. A cycle omits the
 * edge that points back; `"throw"` raises `RangeError` instead. `"preserve"`
 * and `"replace"` omit that edge too, because the flat record cannot point
 * back. A result key of `"__proto__"`, `"prototype"`, or `"constructor"` is
 * skipped. The input is not mutated. `null` and primitives return `undefined`.
 *
 * @param params - The object and flatten options.
 * @returns The flat record, or `undefined` when `object` is not a plain object or array.
 * @throws {RangeError} When `delimiter`, `maxDepth`, `arrays`, `prefix`, or `circular` is invalid, or when a cycle is rejected.
 * @example
 * flattenObject({ object: { user: { name: "Ada" } } });
 */
export function flattenObject(
    params: FlattenObjectParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", flattenFields)) {
        return undefined;
    }
    const state = resolveFlattenState(params);
    const prefix = readPrefix(params.prefix);
    if (!isPlainObjectValue(params.object) && !Array.isArray(params.object)) {
        return undefined;
    }
    walkFlat(params.object, prefix, 0, new Set(), state);
    return state.result;
}

/**
 * Reads flatten options from a recognized parameter object.
 *
 * @param params - The options object.
 * @returns The normalized state and an empty result record.
 * @throws {RangeError} When `delimiter`, `maxDepth`, `arrays`, or `circular` is invalid.
 */
function resolveFlattenState(params: Record<string, unknown>): FlattenState {
    return {
        arrays: readChoice(
            params.arrays,
            "arrays",
            flattenArrayValues,
            "index",
        ),
        circular: readChoice(
            params.circular,
            "circular",
            circularValues,
            "skip",
        ),
        delimiter: readDelimiter(params.delimiter),
        maxDepth: readMaxDepth(params.maxDepth),
        result: {},
    };
}

/**
 * Reads `delimiter`.
 *
 * @param value - The delimiter the caller passed.
 * @returns A non-empty string.
 * @throws {RangeError} When `value` is present and is not a non-empty string.
 */
function readDelimiter(value: unknown): string {
    if (value === undefined) {
        return defaultPathDelimiter;
    }
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    throw new RangeError(
        `\`delimiter\` must be a non-empty string; received ${describeReceived(value)}.`,
    );
}

/**
 * Reads `maxDepth`.
 *
 * @param value - The depth the caller passed.
 * @returns A non-negative finite number, or `Infinity`.
 * @throws {RangeError} When `value` is present and is not a non-negative number.
 */
function readMaxDepth(value: unknown): number {
    if (value === undefined) {
        return Number.POSITIVE_INFINITY;
    }
    if (
        typeof value === "number" &&
        value >= 0 &&
        (Number.isFinite(value) || value === Number.POSITIVE_INFINITY)
    ) {
        return value;
    }
    throw new RangeError(
        `\`maxDepth\` must be a non-negative number; received ${describeReceived(value)}.`,
    );
}

/**
 * Reads `prefix`.
 *
 * @param value - The prefix the caller passed.
 * @returns The prefix. An omitted option is `""`.
 * @throws {RangeError} When `value` is present and is not a string.
 */
function readPrefix(value: unknown): string {
    if (value === undefined) {
        return "";
    }
    if (typeof value === "string") {
        return value;
    }
    throw new RangeError(
        `\`prefix\` must be a string; received ${describeReceived(value)}.`,
    );
}

/**
 * Walks `value` and writes leaves into the result.
 *
 * @param value - The current container or leaf.
 * @param prefix - The key for this node. Empty only at an unprefixed root.
 * @param depth - How many edges have been walked to reach `value`.
 * @param ancestors - Containers on the path from the root.
 * @param state - Flatten options and the result record.
 * @throws {RangeError} When `circular` is `"throw"` and `value` is an ancestor.
 */
function walkFlat(
    value: unknown,
    prefix: string,
    depth: number,
    ancestors: Set<object>,
    state: FlattenState,
): void {
    if (isObjectAncestor(value, ancestors)) {
        if (state.circular === "throw") {
            throw new RangeError(
                '`circular` is "throw" and a nested value points at an ancestor.',
            );
        }
        return;
    }
    if (!isExpandable(value, state.arrays)) {
        assignFlat(state.result, prefix, value);
        return;
    }
    const entries = childEntries(value);
    if (entries.length === 0) {
        if (prefix.length === 0) {
            return;
        }
        assignFlat(state.result, prefix, value);
        return;
    }
    if (depth + 1 > state.maxDepth) {
        assignFlat(state.result, prefix, value);
        return;
    }
    ancestors.add(value);
    for (const [key, child] of entries) {
        const nextPrefix =
            prefix.length === 0 ? key : `${prefix}${state.delimiter}${key}`;
        walkFlat(child, nextPrefix, depth + 1, ancestors, state);
    }
    ancestors.delete(value);
}

/**
 * Whether `value` is already on the path being flattened.
 *
 * @param value - The current value.
 * @param ancestors - Containers on the path from the root.
 * @returns `true` when walking `value` would repeat an ancestor.
 */
function isObjectAncestor(
    value: unknown,
    ancestors: Set<object>,
): value is object {
    return typeof value === "object" && value !== null && ancestors.has(value);
}

/**
 * Whether `value` has children this flatten should walk.
 *
 * @param value - The current value.
 * @param arrays - How arrays are treated.
 * @returns `true` for a plain object, and for an array when indexes are walked.
 */
function isExpandable(value: unknown, arrays: FlattenArrays): value is object {
    if (Array.isArray(value)) {
        return arrays === "index";
    }
    return isPlainObjectValue(value);
}

/**
 * Lists the entries that become the next path segment.
 *
 * @param value - An expandable plain object or array.
 * @returns Key and value pairs. Array holes are omitted.
 */
function childEntries(value: object): readonly (readonly [string, unknown])[] {
    if (Array.isArray(value)) {
        const entries: (readonly [string, unknown])[] = [];
        for (let index = 0; index < value.length; index += 1) {
            if (!Object.hasOwn(value, index)) {
                continue;
            }
            entries.push([String(index), value[index]]);
        }
        return entries;
    }
    const source = value as Record<string, unknown>;
    const entries: (readonly [string, unknown])[] = [];
    for (const key of Object.keys(source)) {
        entries.push([key, source[key]]);
    }
    return entries;
}

/**
 * Stores one leaf when its key is safe.
 *
 * @param result - The flat record. It is mutated.
 * @param key - The joined path.
 * @param value - The leaf value.
 */
function assignFlat(
    result: Record<string, unknown>,
    key: string,
    value: unknown,
): void {
    if (isDangerousKey(key)) {
        return;
    }
    writeOwnProperty(result, key, value, "skip");
}
