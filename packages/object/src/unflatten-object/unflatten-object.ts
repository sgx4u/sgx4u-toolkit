import {
    defaultPathDelimiter,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import type { PrototypeKeys } from "../types/object-config.types.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import {
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { canonicalInteger } from "../utils/path-text.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type {
    UnflattenArrays,
    UnflattenObjectParams,
} from "./unflatten-object.types.js";

const unflattenFields = [
    "object",
    "delimiter",
    "arrays",
    "prototypeKeys",
] as const;

const unflattenArrayValues = ["auto", "never", "always"] as const;

interface UnflattenState {
    delimiter: string;
    arrays: UnflattenArrays;
    prototypeKeys: PrototypeKeys;
    trieNodes: WeakSet<object>;
}

/**
 * Rebuilds a nested object from a flat record of paths.
 *
 * Each own enumerable key is split on `delimiter`. The tree is built from
 * plain objects, then integer keys become arrays. `"auto"` converts a node
 * only when its keys are exactly `"0"` through `"n-1"` with no holes.
 * `"always"` converts a node whose keys are all canonical integers and keeps
 * holes. `"never"` leaves every node as an object. An empty node stays an
 * object. A dangerous segment is skipped, thrown, or written as an own data
 * property according to `prototypeKeys`. A flat key is dropped as a whole
 * when `"skip"` sees a dangerous segment, so no empty parent is left behind.
 * Leaf values are stored as-is. The input is not mutated. `null`, primitives,
 * and arrays return `undefined`.
 *
 * @param params - The flat record and unflatten options.
 * @returns The nested value, or `undefined` when `object` is not a plain object.
 * @throws {RangeError} When `delimiter`, `arrays`, or `prototypeKeys` is invalid, or a dangerous segment is rejected.
 * @example
 * unflattenObject({ object: { "user.name": "Ada" } });
 */
export function unflattenObject(params: UnflattenObjectParams): unknown {
    if (!isParameterRecord(params, "object", unflattenFields)) {
        return undefined;
    }
    const state = resolveUnflattenState(params);
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    const root = createTrie(state);
    for (const key of Object.keys(params.object)) {
        insertPath(root, key, params.object[key], state);
    }
    return finalizeNode(root, state);
}

/**
 * Reads unflatten options from a recognized parameter object.
 *
 * @param params - The options object.
 * @returns The normalized state.
 * @throws {RangeError} When `delimiter`, `arrays`, or `prototypeKeys` is invalid.
 */
function resolveUnflattenState(
    params: Record<string, unknown>,
): UnflattenState {
    return {
        arrays: readChoice(
            params.arrays,
            "arrays",
            unflattenArrayValues,
            "auto",
        ),
        delimiter: readDelimiter(params.delimiter),
        prototypeKeys: readChoice(
            params.prototypeKeys,
            "prototypeKeys",
            prototypeKeyValues,
            "skip",
        ),
        trieNodes: new WeakSet(),
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
 * A new null-prototype node marked as part of the path tree.
 *
 * Leaf objects are not marked, so a stored object value is not walked again.
 *
 * @param state - Unflatten options. The node is recorded on `trieNodes`.
 * @returns An empty dictionary.
 */
function createTrie(state: UnflattenState): Record<string, unknown> {
    const node = Object.create(null) as Record<string, unknown>;
    state.trieNodes.add(node);
    return node;
}

/**
 * Writes one flat entry into the tree.
 *
 * A later key overwrites an earlier leaf or object at the same path. A longer
 * path replaces a leaf at a shorter path.
 *
 * @param root - The root trie node.
 * @param key - One flat key.
 * @param value - The leaf value.
 * @param state - Unflatten options.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a segment is dangerous.
 */
function insertPath(
    root: Record<string, unknown>,
    key: string,
    value: unknown,
    state: UnflattenState,
): void {
    const segments = splitFlatKey(key, state.delimiter);
    if (rejectDangerousPath(segments, state.prototypeKeys)) {
        return;
    }
    let node = root;
    for (let index = 0; index < segments.length; index += 1) {
        const segment = segments[index];
        if (segment === undefined) {
            return;
        }
        const last = index === segments.length - 1;
        if (last) {
            writeOwnProperty(node, segment, value, "keep");
            return;
        }
        node = childTrie(node, segment, state);
    }
}

/**
 * Applies the prototype policy to every segment of one flat key.
 *
 * @param segments - The split key.
 * @param prototypeKeys - The prototype policy.
 * @returns `true` when the whole key must be dropped.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a segment is dangerous.
 */
function rejectDangerousPath(
    segments: readonly string[],
    prototypeKeys: PrototypeKeys,
): boolean {
    for (const segment of segments) {
        if (!isDangerousKey(segment)) {
            continue;
        }
        if (prototypeKeys === "throw") {
            throw new RangeError(
                `\`prototypeKeys\` blocked the dangerous key "${segment}".`,
            );
        }
        if (prototypeKeys === "skip") {
            return true;
        }
    }
    return false;
}

/**
 * The trie child at `segment`, creating one when the current value is not a trie node.
 *
 * @param node - The parent trie node. It is mutated.
 * @param segment - The next path segment.
 * @param state - Unflatten options.
 * @returns The child trie node.
 */
function childTrie(
    node: Record<string, unknown>,
    segment: string,
    state: UnflattenState,
): Record<string, unknown> {
    const existing = readOwnProperty(node, segment);
    if (isTrie(existing, state)) {
        return existing;
    }
    const child = createTrie(state);
    writeOwnProperty(node, segment, child, "keep");
    return child;
}

/**
 * Whether `value` is a trie node created for this call.
 *
 * @param value - A stored value.
 * @param state - Unflatten options.
 * @returns `true` when `value` was created by {@link createTrie}.
 */
function isTrie(
    value: unknown,
    state: UnflattenState,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        state.trieNodes.has(value)
    );
}

/**
 * Splits `key` on `delimiter`.
 *
 * A trailing delimiter produces an empty final segment.
 *
 * @param key - One flat key.
 * @param delimiter - The separator.
 * @returns The segments. A key with no separator is one segment.
 */
function splitFlatKey(key: string, delimiter: string): string[] {
    const segments: string[] = [];
    let start = 0;
    while (start <= key.length) {
        const found = key.indexOf(delimiter, start);
        if (found === -1) {
            segments.push(key.slice(start));
            break;
        }
        segments.push(key.slice(start, found));
        start = found + delimiter.length;
        if (start === key.length) {
            segments.push("");
            break;
        }
    }
    return segments;
}

/**
 * Copies a trie node into an ordinary object or array.
 *
 * @param value - A trie node or a leaf.
 * @param state - Unflatten options.
 * @returns The value callers receive.
 */
function finalizeNode(value: unknown, state: UnflattenState): unknown {
    if (!isTrie(value, state)) {
        return value;
    }
    const keys = Object.keys(value);
    const record: Record<string, unknown> = {};
    for (const key of keys) {
        writeOwnProperty(record, key, finalizeNode(value[key], state), "keep");
    }
    return coerceArray(record, keys, state.arrays);
}

/**
 * Turns `record` into an array when `arrays` asks for it.
 *
 * @param record - A finalized object.
 * @param keys - The own keys of `record`, in enumeration order.
 * @param arrays - The array policy.
 * @returns `record`, or an array of its values.
 */
function coerceArray(
    record: Record<string, unknown>,
    keys: readonly string[],
    arrays: UnflattenArrays,
): Record<string, unknown> | unknown[] {
    if (arrays === "never" || keys.length === 0) {
        return record;
    }
    if (arrays === "auto") {
        if (!isDenseIndexKeys(keys)) {
            return record;
        }
        const dense: unknown[] = [];
        for (let index = 0; index < keys.length; index += 1) {
            dense.push(record[String(index)]);
        }
        return dense;
    }
    if (!keys.every((key) => canonicalInteger(key) !== undefined)) {
        return record;
    }
    return sparseArray(record, keys);
}

/**
 * Whether `keys` are exactly `"0"` through `"n-1"`.
 *
 * @param keys - The keys of one node.
 * @returns `true` when the node has no holes and no extra keys.
 */
function isDenseIndexKeys(keys: readonly string[]): boolean {
    const seen: boolean[] = [];
    seen.length = keys.length;
    for (const key of keys) {
        const index = canonicalInteger(key);
        if (
            index === undefined ||
            index >= keys.length ||
            seen[index] === true
        ) {
            return false;
        }
        seen[index] = true;
    }
    return true;
}

/**
 * Builds an array that may contain holes.
 *
 * @param record - A node whose keys are all canonical integers.
 * @param keys - Those keys.
 * @returns An array whose length is one past the largest index.
 */
function sparseArray(
    record: Record<string, unknown>,
    keys: readonly string[],
): unknown[] {
    let maxIndex = 0;
    for (const key of keys) {
        const index = canonicalInteger(key);
        if (index !== undefined && index > maxIndex) {
            maxIndex = index;
        }
    }
    const array: unknown[] = [];
    array.length = maxIndex + 1;
    for (const key of keys) {
        const index = canonicalInteger(key);
        if (index === undefined) {
            continue;
        }
        array[index] = record[key];
    }
    return array;
}
