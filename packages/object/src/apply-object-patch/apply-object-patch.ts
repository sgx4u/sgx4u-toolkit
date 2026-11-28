import type { ObjectDiff } from "../types/object-diff.types.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { ApplyObjectPatchParams } from "./apply-object-patch.types.js";

/**
 * Applies a structural diff without mutating `object`.
 *
 * `"unchanged"` returns `object`. `"added"` and `"changed"` return the new
 * value. `"removed"` returns `undefined`. An object diff copies the object
 * and applies each property. An array diff rebuilds by original index:
 * removed indexes are omitted, added indexes are inserted, and the other
 * indexes are kept. An invalid patch returns `undefined`.
 *
 * @param params - The value and the patch.
 * @returns The patched value, or `undefined` when the patch is invalid or removes the root.
 * @example
 * applyObjectPatch({
 *     object: { id: 1 },
 *     patch: { kind: "object", properties: { id: { from: 1, kind: "changed", to: 2 } } },
 * });
 */
export function applyObjectPatch(params: ApplyObjectPatchParams): unknown {
    if (!isObjectDiff(params.patch)) {
        return undefined;
    }
    return applyDiff(params.object, params.patch);
}

/**
 * Applies a patch that has already been validated.
 *
 * @param object - The current value.
 * @param patch - A valid diff.
 * @returns The patched value.
 */
export function applyDiff(object: unknown, patch: ObjectDiff): unknown {
    switch (patch.kind) {
        case "unchanged":
            return object;
        case "added":
            return patch.value;
        case "removed":
            return undefined;
        case "changed":
            return patch.to;
        case "object":
            return applyProperties(object, patch.properties);
        case "array":
            return applyItems(object, patch.items);
    }
}

/**
 * Reports whether `value` is an `ObjectDiff`, including nested diffs.
 *
 * A cycle in the patch is invalid.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a valid diff.
 */
export function isObjectDiff(value: unknown): value is ObjectDiff {
    return isDiffNode(value, new Set(), new Set());
}

/**
 * Validates one diff node.
 *
 * @param value - The candidate.
 * @param stack - Diff objects currently being validated.
 * @param done - Diff objects that already passed validation.
 * @returns `true` when the node is valid.
 */
function isDiffNode(
    value: unknown,
    stack: Set<object>,
    done: Set<object>,
): value is ObjectDiff {
    if (!isPlainObjectValue(value)) {
        return false;
    }
    if (done.has(value)) {
        return true;
    }
    if (stack.has(value)) {
        return false;
    }
    stack.add(value);
    const valid = hasDiffShape(value, stack, done);
    stack.delete(value);
    if (valid) {
        done.add(value);
    }
    return valid;
}

/**
 * Checks the discriminator and the fields that belong to it.
 *
 * @param value - A plain object.
 * @param stack - Diff objects currently being validated.
 * @param done - Diff objects that already passed validation.
 * @returns `true` when the shape matches `ObjectDiff`.
 */
function hasDiffShape(
    value: Record<string, unknown>,
    stack: Set<object>,
    done: Set<object>,
): boolean {
    const kind = value.kind;
    if (kind === "unchanged") {
        return true;
    }
    if (kind === "added" || kind === "removed") {
        return Object.hasOwn(value, "value");
    }
    if (kind === "changed") {
        return Object.hasOwn(value, "from") && Object.hasOwn(value, "to");
    }
    if (kind === "object") {
        return isPropertyMap(value.properties, stack, done);
    }
    if (kind === "array") {
        return isItemList(value.items, stack, done);
    }
    return false;
}

/**
 * Whether `value` is a map of valid diffs.
 *
 * @param value - The `properties` field.
 * @param stack - Diff objects currently being validated.
 * @param done - Diff objects that already passed validation.
 * @returns `true` when every property is a valid diff.
 */
function isPropertyMap(
    value: unknown,
    stack: Set<object>,
    done: Set<object>,
): boolean {
    if (!isPlainObjectValue(value)) {
        return false;
    }
    for (const key of Object.keys(value)) {
        if (!isDiffNode(value[key], stack, done)) {
            return false;
        }
    }
    return true;
}

/**
 * Whether `value` is a list of `{ index, diff }` entries.
 *
 * @param value - The `items` field.
 * @param stack - Diff objects currently being validated.
 * @param done - Diff objects that already passed validation.
 * @returns `true` when every entry is valid.
 */
function isItemList(
    value: unknown,
    stack: Set<object>,
    done: Set<object>,
): boolean {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const item of value) {
        if (!isPlainObjectValue(item)) {
            return false;
        }
        const index = item.index;
        if (typeof index !== "number" || !isSafeIndex(index)) {
            return false;
        }
        if (!isDiffNode(item.diff, stack, done)) {
            return false;
        }
    }
    return true;
}

/**
 * Whether `index` can address an array slot.
 *
 * @param index - A numeric candidate.
 * @returns `true` for a safe integer that is not negative.
 */
function isSafeIndex(index: number): boolean {
    return Number.isSafeInteger(index) && index >= 0;
}

/**
 * Copies a plain object and applies each property diff.
 *
 * @param object - The current value. A non-plain value starts from `{}`.
 * @param properties - Property diffs. Unchanged entries are ignored.
 * @returns The patched object.
 */
function applyProperties(
    object: unknown,
    properties: Record<string, ObjectDiff>,
): Record<string, unknown> {
    const copy = copyPlain(object);
    for (const key of Object.keys(properties)) {
        const diff = properties[key];
        if (diff === undefined) {
            continue;
        }
        applyProperty(copy, key, diff);
    }
    return copy;
}

/**
 * Writes one property diff onto a copy.
 *
 * @param target - The copied object. It is mutated.
 * @param key - The property name.
 * @param diff - The diff for that property.
 * @returns Nothing.
 */
function applyProperty(
    target: Record<string, unknown>,
    key: string,
    diff: ObjectDiff,
): void {
    if (diff.kind === "unchanged") {
        return;
    }
    if (diff.kind === "removed") {
        Reflect.deleteProperty(target, key);
        return;
    }
    if (diff.kind === "added") {
        writeOwnProperty(target, key, diff.value, "keep");
        return;
    }
    if (diff.kind === "changed") {
        writeOwnProperty(target, key, diff.to, "keep");
        return;
    }
    const current = Object.hasOwn(target, key)
        ? readOwnProperty(target, key)
        : undefined;
    writeOwnProperty(target, key, applyDiff(current, diff), "keep");
}

/**
 * Rebuilds an array from original indexes.
 *
 * An added diff at an existing index inserts the new value and keeps the
 * original element after it. A removed diff omits that index. Later elements
 * shift with those edits.
 *
 * @param object - The current value. A non-array is treated as empty.
 * @param items - Index diffs. The last diff for an index wins.
 * @returns The patched array.
 */
function applyItems(
    object: unknown,
    items: Array<{ index: number; diff: ObjectDiff }>,
): unknown[] {
    const source = Array.isArray(object) ? object : [];
    const byIndex = new Map<number, ObjectDiff>();
    let maxIndex = source.length - 1;
    for (const item of items) {
        byIndex.set(item.index, item.diff);
        if (item.index > maxIndex) {
            maxIndex = item.index;
        }
    }
    const result: unknown[] = [];
    for (let index = 0; index <= maxIndex; index += 1) {
        appendIndex(result, source, index, byIndex.get(index));
    }
    return result;
}

/**
 * Appends the value for one original index.
 *
 * @param result - The array being built. It is mutated.
 * @param source - The original array.
 * @param index - The original index.
 * @param diff - The diff at that index, if one was listed.
 * @returns Nothing.
 */
function appendIndex(
    result: unknown[],
    source: unknown[],
    index: number,
    diff: ObjectDiff | undefined,
): void {
    const hasOriginal = index < source.length;
    if (diff === undefined || diff.kind === "unchanged") {
        if (hasOriginal) {
            result.push(source[index]);
        }
        return;
    }
    if (diff.kind === "removed") {
        return;
    }
    if (diff.kind === "added") {
        result.push(diff.value);
        if (hasOriginal) {
            result.push(source[index]);
        }
        return;
    }
    if (diff.kind === "changed") {
        result.push(diff.to);
        return;
    }
    const current = hasOriginal ? source[index] : undefined;
    result.push(applyDiff(current, diff));
}

/**
 * Copies own enumerable keys onto a new dictionary.
 *
 * A null prototype stays null. A value that is not a plain object yields `{}`.
 *
 * @param object - The value to copy.
 * @returns A new dictionary.
 */
function copyPlain(object: unknown): Record<string, unknown> {
    if (!isPlainObjectValue(object)) {
        return {};
    }
    const target = createDictionary(object);
    for (const key of Object.keys(object)) {
        writeOwnProperty(target, key, readOwnProperty(object, key), "keep");
    }
    for (const symbol of Object.getOwnPropertySymbols(object)) {
        const descriptor = Object.getOwnPropertyDescriptor(object, symbol);
        if (descriptor?.enumerable === true && "value" in descriptor) {
            writeOwnProperty(target, symbol, descriptor.value, "keep");
        }
    }
    return target;
}
