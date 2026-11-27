import { prototypeKeyValues } from "../constants/object-options.constants.js";
import type { PrototypeKeys } from "../types/object-config.types.js";
import type { JSONPatchOperation } from "../types/json-patch.types.js";
import type { PathSegment } from "../types/path.types.js";
import {
    copyEnumerableProperties,
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import { cloneJSONData, jsonDataAreEqual } from "../utils/json-data.utils.js";
import {
    jsonPatchIssue,
    readJSONPatchOperations,
} from "../utils/json-patch.utils.js";
import {
    arrayIndexFromSegment,
    parseJSONPointerText,
} from "../utils/path-text.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { ApplyJSONPatchParams } from "./apply-json-patch.types.js";

interface EditSuccess {
    ok: true;
    value: unknown;
}

interface EditFailure {
    ok: false;
}

type EditResult = EditSuccess | EditFailure;

/**
 * Applies an RFC 6902 JSON Patch without mutating `object`.
 *
 * Operations are checked before any edit, so a malformed operation throws
 * `RangeError` even when an earlier operation would have succeeded. A failed
 * `"test"`, or a missing target while `strict` is `true`, returns `undefined`
 * and discards the copy. `strict: false` skips a missing target for `"add"`,
 * `"remove"`, `"replace"`, `"move"`, and `"copy"` and continues.
 *
 * `"add"` on `""` replaces the document. An array token `"-"` appends. An
 * array index `"add"` inserts and shifts later items. `"replace"` overwrites
 * an existing element. `"move"` is a `"remove"` of `from` followed by an
 * `"add"` at `path`, so indexes are read after the removal. Moving a location
 * into its own child returns `undefined`.
 *
 * Dangerous segments use `prototypeKeys`. `"skip"` leaves the document
 * unchanged for that operation and does not read or write `Object.prototype`.
 * Inserted values are cloned.
 *
 * `undefined` means the patch failed. A successful result of `undefined` is
 * not distinguished from failure.
 *
 * @param params - The document, the patch, and the failure policy.
 * @returns The patched copy, or `undefined` when the patch fails.
 * @throws {TypeError} When `params` is not a plain object.
 * @throws {RangeError} When the patch is malformed, `strict` is not a boolean, or `prototypeKeys` is unknown.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a segment is dangerous.
 * @example
 * applyJSONPatch({
 *     object: { a: 1 },
 *     patch: [{ op: "add", path: "/b", value: 2 }],
 * });
 */
export function applyJSONPatch(params: ApplyJSONPatchParams): unknown {
    if (!isPlainObjectValue(params)) {
        throw new TypeError(
            `\`params\` must be a plain object; received ${describeReceived(params)}.`,
        );
    }
    const issue = jsonPatchIssue(params.patch);
    if (issue !== undefined) {
        throw new RangeError(issue);
    }
    const strict = readStrict(params.strict);
    const prototypeKeys = readChoice(
        params.prototypeKeys,
        "prototypeKeys",
        prototypeKeyValues,
        "skip",
    );
    const patch = readJSONPatchOperations(params.patch);
    let current = params.object;
    for (const operation of patch) {
        const step = applyOperation(current, operation, strict, prototypeKeys);
        if (!step.ok) {
            return undefined;
        }
        current = step.value;
    }
    return current;
}

/**
 * Applies one operation to a copy of `current`.
 *
 * @param current - The document so far.
 * @param operation - A well-formed operation.
 * @param strict - Whether a missing target fails the patch.
 * @param prototypeKeys - How dangerous segments are written.
 * @returns The next document, or a failure.
 * @throws {RangeError} When a dangerous segment is rejected.
 */
function applyOperation(
    current: unknown,
    operation: JSONPatchOperation,
    strict: boolean,
    prototypeKeys: PrototypeKeys,
): EditResult {
    const segments = parseJSONPointerText(operation.path) ?? [];
    switch (operation.op) {
        case "add":
            return allowMissing(
                applyAdd(current, segments, operation.value, prototypeKeys),
                current,
                strict,
            );
        case "remove":
            return allowMissing(
                applyRemove(current, segments, prototypeKeys),
                current,
                strict,
            );
        case "replace":
            return allowMissing(
                applyReplace(current, segments, operation.value, prototypeKeys),
                current,
                strict,
            );
        case "move":
            return applyMove(current, operation, strict, prototypeKeys);
        case "copy":
            return applyCopy(current, operation, strict, prototypeKeys);
        case "test":
            return applyTest(current, segments, operation.value, prototypeKeys);
    }
}

/**
 * Turns a missing-target failure into a skipped success when `strict` is false.
 *
 * @param result - The edit.
 * @param current - The document to keep when the edit is skipped.
 * @param strict - Whether a failure stays a failure.
 * @returns `result`, or `current` when a non-strict edit missed.
 */
function allowMissing(
    result: EditResult,
    current: unknown,
    strict: boolean,
): EditResult {
    if (result.ok || strict) {
        return result;
    }
    return succeeded(current);
}

/**
 * Adds `value` at `segments`.
 *
 * An empty pointer replaces the document.
 *
 * @param root - The document.
 * @param segments - The target pointer.
 * @param value - The value to insert. It is cloned.
 * @param prototypeKeys - How a dangerous key is written.
 * @returns The edited document, or a failure when the parent is missing.
 */
function applyAdd(
    root: unknown,
    segments: readonly PathSegment[],
    value: unknown,
    prototypeKeys: PrototypeKeys,
): EditResult {
    if (segments.length === 0) {
        return succeeded(cloneJSONData(value));
    }
    return descend(root, segments, prototypeKeys, (container, segment) =>
        editChild(container, segment, "add", value, prototypeKeys),
    );
}

/**
 * Removes the value at `segments`.
 *
 * Removing the document itself fails. An array index is spliced out.
 *
 * @param root - The document.
 * @param segments - The target pointer.
 * @param prototypeKeys - How a dangerous key is treated.
 * @returns The edited document, or a failure when the target is missing.
 */
function applyRemove(
    root: unknown,
    segments: readonly PathSegment[],
    prototypeKeys: PrototypeKeys,
): EditResult {
    if (segments.length === 0) {
        return failed();
    }
    return descend(root, segments, prototypeKeys, (container, segment) =>
        editChild(container, segment, "remove", undefined, prototypeKeys),
    );
}

/**
 * Replaces the value at `segments`.
 *
 * An empty pointer replaces the document. The target must already exist.
 *
 * @param root - The document.
 * @param segments - The target pointer.
 * @param value - The replacement. It is cloned.
 * @param prototypeKeys - How a dangerous key is written.
 * @returns The edited document, or a failure when the target is missing.
 */
function applyReplace(
    root: unknown,
    segments: readonly PathSegment[],
    value: unknown,
    prototypeKeys: PrototypeKeys,
): EditResult {
    if (segments.length === 0) {
        return succeeded(cloneJSONData(value));
    }
    return descend(root, segments, prototypeKeys, (container, segment) =>
        editChild(container, segment, "replace", value, prototypeKeys),
    );
}

/**
 * Moves `from` to `path`.
 *
 * The value is removed first. `path` is then applied to that result, matching
 * RFC 6902. A `from` that is a proper prefix of `path` always fails.
 *
 * @param root - The document.
 * @param operation - The move operation. `from` was validated.
 * @param strict - Whether a missing source or target fails the patch.
 * @param prototypeKeys - How dangerous keys are written.
 * @returns The edited document, or a failure.
 */
function applyMove(
    root: unknown,
    operation: JSONPatchOperation,
    strict: boolean,
    prototypeKeys: PrototypeKeys,
): EditResult {
    const from = pointerSegments(operation.from);
    const path = pointerSegments(operation.path);
    if (
        from === undefined ||
        path === undefined ||
        isProperPrefix(from, path)
    ) {
        return failed();
    }
    const source = readPointer(root, from, prototypeKeys);
    if (!source.ok) {
        return strict ? failed() : succeeded(root);
    }
    const removed = applyRemove(root, from, prototypeKeys);
    if (!removed.ok) {
        return strict ? failed() : succeeded(root);
    }
    const added = applyAdd(removed.value, path, source.value, prototypeKeys);
    if (!added.ok) {
        return strict ? failed() : succeeded(root);
    }
    return added;
}

/**
 * Copies `from` onto `path`.
 *
 * The source stays in place. The inserted value is a clone.
 *
 * @param root - The document.
 * @param operation - The copy operation. `from` was validated.
 * @param strict - Whether a missing source or target fails the patch.
 * @param prototypeKeys - How dangerous keys are written.
 * @returns The edited document, or a failure.
 */
function applyCopy(
    root: unknown,
    operation: JSONPatchOperation,
    strict: boolean,
    prototypeKeys: PrototypeKeys,
): EditResult {
    const from = pointerSegments(operation.from);
    const path = pointerSegments(operation.path);
    if (from === undefined || path === undefined) {
        return failed();
    }
    const source = readPointer(root, from, prototypeKeys);
    if (!source.ok) {
        return strict ? failed() : succeeded(root);
    }
    const added = applyAdd(root, path, source.value, prototypeKeys);
    if (!added.ok) {
        return strict ? failed() : succeeded(root);
    }
    return added;
}

/**
 * Checks the value at `segments` without editing.
 *
 * A missing path fails even when `strict` is `false`.
 *
 * @param root - The document.
 * @param segments - The target pointer.
 * @param value - The expected value.
 * @param prototypeKeys - How a dangerous key is read.
 * @returns `root` when the value matches, otherwise a failure.
 */
function applyTest(
    root: unknown,
    segments: readonly PathSegment[],
    value: unknown,
    prototypeKeys: PrototypeKeys,
): EditResult {
    const found = readPointer(root, segments, prototypeKeys);
    if (!found.ok || !jsonDataAreEqual(found.value, value)) {
        return failed();
    }
    return succeeded(root);
}

/**
 * Edits the parent named by the last segment, copying ancestors.
 *
 * A skipped dangerous segment leaves `current` in place. A thrown dangerous
 * segment raises before the caller keeps a copy.
 *
 * @param current - The value at this level.
 * @param segments - The full pointer.
 * @param prototypeKeys - How dangerous keys are written.
 * @param leaf - Edits the parent container and the last segment.
 * @returns The edited value, or a failure when a parent is missing.
 * @throws {RangeError} When a dangerous segment is rejected.
 */
function descend(
    current: unknown,
    segments: readonly PathSegment[],
    prototypeKeys: PrototypeKeys,
    leaf: (container: unknown, segment: PathSegment) => EditResult,
): EditResult {
    return descendAt(current, segments, 0, prototypeKeys, leaf);
}

/**
 * Edits `segments` starting at `index`.
 *
 * @param current - The value at this level.
 * @param segments - The full pointer.
 * @param index - The segment to apply.
 * @param prototypeKeys - How dangerous keys are written.
 * @param leaf - Edits the parent container and the last segment.
 * @returns The edited value.
 * @throws {RangeError} When a dangerous segment is rejected.
 */
function descendAt(
    current: unknown,
    segments: readonly PathSegment[],
    index: number,
    prototypeKeys: PrototypeKeys,
    leaf: (container: unknown, segment: PathSegment) => EditResult,
): EditResult {
    const segment = segments[index];
    if (segment === undefined) {
        return failed();
    }
    if (guardSegment(segment, prototypeKeys) === "skip") {
        return succeeded(current);
    }
    if (index === segments.length - 1) {
        return leaf(current, segment);
    }
    const child = readChild(current, segment);
    if (!child.ok) {
        return failed();
    }
    const nested = descendAt(
        child.value,
        segments,
        index + 1,
        prototypeKeys,
        leaf,
    );
    if (!nested.ok) {
        return nested;
    }
    if (nested.value === child.value) {
        return succeeded(current);
    }
    return assignChild(current, segment, nested.value);
}

/**
 * Reads `segments` without copying.
 *
 * An empty pointer returns `root`. A skipped dangerous segment is missing.
 *
 * @param root - The document.
 * @param segments - The pointer.
 * @param prototypeKeys - How a dangerous key is read.
 * @returns The value, or a failure when a segment is missing.
 * @throws {RangeError} When a dangerous segment is rejected.
 */
function readPointer(
    root: unknown,
    segments: readonly PathSegment[],
    prototypeKeys: PrototypeKeys,
): EditResult {
    let current = root;
    for (const segment of segments) {
        if (guardSegment(segment, prototypeKeys) === "skip") {
            return failed();
        }
        const child = readChild(current, segment);
        if (!child.ok) {
            return failed();
        }
        current = child.value;
    }
    return succeeded(current);
}

/**
 * Rejects or skips a dangerous segment.
 *
 * @param segment - The segment being entered.
 * @param prototypeKeys - The prototype policy.
 * @returns `"skip"` when the segment must not be walked, otherwise `"write"`.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and `segment` is dangerous.
 */
function guardSegment(
    segment: PathSegment,
    prototypeKeys: PrototypeKeys,
): "skip" | "write" {
    if (!isDangerousKey(segment)) {
        return "write";
    }
    if (prototypeKeys === "throw") {
        throw new RangeError(
            `\`prototypeKeys\` blocked the dangerous key "${String(segment)}".`,
        );
    }
    if (prototypeKeys === "skip") {
        return "skip";
    }
    return "write";
}

/**
 * Reads an own child. Inherited properties, including `__proto__`, do not match.
 *
 * @param container - The parent value.
 * @param segment - The child name or index.
 * @returns The child, or a failure when it is missing.
 */
function readChild(container: unknown, segment: PathSegment): EditResult {
    if (Array.isArray(container)) {
        const index = arrayIndexFromSegment(segment);
        if (index === undefined || !Object.hasOwn(container, index)) {
            return failed();
        }
        return succeeded(container[index]);
    }
    if (!isObjectLikeValue(container) || !Object.hasOwn(container, segment)) {
        return failed();
    }
    return succeeded(readOwnProperty(container, segment));
}

/**
 * Copies `container` and stores `childValue` at `segment`.
 *
 * @param container - The parent to copy.
 * @param segment - The child that changed.
 * @param childValue - The new child.
 * @returns The copy.
 */
function assignChild(
    container: unknown,
    segment: PathSegment,
    childValue: unknown,
): EditResult {
    if (Array.isArray(container)) {
        const copy = container.slice();
        copy[segment as number] = childValue;
        return succeeded(copy);
    }
    const copy = copyEnumerableProperties(container as object, "keep");
    writeOwnProperty(copy, segment, childValue, "keep");
    return succeeded(copy);
}

/**
 * Adds, replaces, or removes the child named by `segment`.
 *
 * An array `"add"` splices. `"-"` appends. An index past `length` fails.
 * `"replace"` and `"remove"` require an existing element. An object `"add"`
 * creates or overwrites the key. The input is not mutated.
 *
 * @param container - The parent.
 * @param segment - The last pointer token.
 * @param mode - Which edit to apply.
 * @param value - The value for `"add"` and `"replace"`. Ignored by `"remove"`.
 * @param prototypeKeys - How a dangerous key is written.
 * @returns The new parent, or a failure when the child cannot be edited.
 */
function editChild(
    container: unknown,
    segment: PathSegment,
    mode: "add" | "replace" | "remove",
    value: unknown,
    prototypeKeys: PrototypeKeys,
): EditResult {
    if (Array.isArray(container)) {
        return editArray(container, segment, mode, value);
    }
    if (!isObjectLikeValue(container)) {
        return failed();
    }
    if (mode !== "add" && !Object.hasOwn(container, segment)) {
        return failed();
    }
    const copy = copyEnumerableProperties(container, "keep");
    if (mode === "remove") {
        Reflect.deleteProperty(copy, segment);
        return succeeded(copy);
    }
    writeOwnProperty(copy, segment, cloneJSONData(value), prototypeKeys);
    return succeeded(copy);
}

/**
 * Edits an array index or appends with `"-"`.
 *
 * @param container - The parent array. It is not mutated.
 * @param segment - The last pointer token.
 * @param mode - Which edit to apply.
 * @param value - The value for `"add"` and `"replace"`.
 * @returns The new array, or a failure when the index is illegal.
 */
function editArray(
    container: unknown[],
    segment: PathSegment,
    mode: "add" | "replace" | "remove",
    value: unknown,
): EditResult {
    if (mode === "add" && segment === "-") {
        const copy = container.slice();
        copy.push(cloneJSONData(value));
        return succeeded(copy);
    }
    const index = arrayIndexFromSegment(segment);
    const missing =
        index === undefined ||
        (mode === "add"
            ? index > container.length
            : !Object.hasOwn(container, index));
    if (missing || index === undefined) {
        return failed();
    }
    const copy = container.slice();
    if (mode === "remove") {
        copy.splice(index, 1);
    } else if (mode === "add") {
        copy.splice(index, 0, cloneJSONData(value));
    } else {
        copy[index] = cloneJSONData(value);
    }
    return succeeded(copy);
}

/**
 * Whether `prefix` names a parent of `path`.
 *
 * The empty pointer is a prefix of every longer pointer.
 *
 * @param prefix - The `from` segments.
 * @param path - The target segments.
 * @returns `true` when `from` is a proper prefix of `path`.
 */
function isProperPrefix(
    prefix: readonly PathSegment[],
    path: readonly PathSegment[],
): boolean {
    if (prefix.length >= path.length) {
        return false;
    }
    for (let index = 0; index < prefix.length; index += 1) {
        if (prefix[index] !== path[index]) {
            return false;
        }
    }
    return true;
}

/**
 * Parses a pointer that was already validated, or returns `undefined`.
 *
 * @param pointer - `path` or `from` text.
 * @returns The segments, or `undefined` when the text is missing or illegal.
 */
function pointerSegments(
    pointer: string | undefined,
): PathSegment[] | undefined {
    if (pointer === undefined) {
        return undefined;
    }
    return parseJSONPointerText(pointer);
}

/**
 * Reads `strict`. Omitted means `true`.
 *
 * @param value - The option the caller passed.
 * @returns The flag.
 * @throws {RangeError} When `value` is present and is not a boolean.
 */
function readStrict(value: unknown): boolean {
    if (value === undefined) {
        return true;
    }
    if (typeof value === "boolean") {
        return value;
    }
    throw new RangeError(
        `\`strict\` must be a boolean; received ${describeReceived(value)}.`,
    );
}

/**
 * A successful edit.
 *
 * @param value - The next document.
 * @returns The success result.
 */
function succeeded(value: unknown): EditSuccess {
    return { ok: true, value };
}

/**
 * A failed edit. The caller discards any copy.
 *
 * @returns The failure result.
 */
function failed(): EditFailure {
    return { ok: false };
}
