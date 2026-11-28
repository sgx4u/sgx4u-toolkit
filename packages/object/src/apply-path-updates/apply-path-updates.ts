import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { setPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";
import type { ApplyPathUpdatesParams } from "./apply-path-updates.types.js";

/**
 * One normalized write.
 */
interface NormalizedUpdate {
    path: ObjectPath;
    value: unknown;
}

/**
 * Applies path writes from left to right and returns the new object.
 *
 * `updates` may be a plain object whose keys are path strings, or an array
 * of `{ path, value }` entries. Each write uses `setPathSegments`. A later
 * write sees the earlier results. An empty path replaces the current root.
 * An illegal path and an array entry without a path are skipped. When no
 * write changes the value, the same object is returned. The input and
 * `updates` are not mutated.
 *
 * Dangerous keys follow `prototypeKeys`. `"skip"` does not change
 * `Object.prototype`. The call returns `undefined` when `object` is not
 * object-like, or when `updates` is neither a plain object nor an array.
 *
 * @param params - The object, the writes, and the path options.
 * @returns The edited object, or `undefined` when the input is not valid.
 * @throws {RangeError} When `pathStyle` or `prototypeKeys` is unknown, `pathDelimiter` is empty, or a dangerous key is rejected.
 * @example
 * applyPathUpdates({ object: { a: 1 }, updates: { "b.c": 2 } });
 */
export function applyPathUpdates(params: ApplyPathUpdatesParams): unknown {
    const pathStyle = readChoice(
        params.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const prototypeKeys = readChoice(
        params.prototypeKeys,
        "prototypeKeys",
        prototypeKeyValues,
        "skip",
    );
    const pathDelimiter = readPathDelimiter(
        params.pathDelimiter,
        defaultPathDelimiter,
    );
    const updates = readUpdates(params.updates);
    if (!isObjectLikeValue(params.object) || updates === undefined) {
        return undefined;
    }
    return applyUpdates(
        params.object,
        updates,
        pathStyle,
        pathDelimiter,
        prototypeKeys,
    );
}

/**
 * Writes each update onto a running copy.
 *
 * @param object - The starting object.
 * @param updates - Normalized writes, in order.
 * @param pathStyle - How a string path is parsed.
 * @param pathDelimiter - The dot-path separator.
 * @param prototypeKeys - How dangerous keys are written.
 * @returns The edited value.
 * @throws {RangeError} When a dangerous key is rejected.
 */
function applyUpdates(
    object: object,
    updates: readonly NormalizedUpdate[],
    pathStyle: PathStyle,
    pathDelimiter: string,
    prototypeKeys: PrototypeKeys,
): unknown {
    let current: unknown = object;
    for (const update of updates) {
        const segments = resolvePathSegments(
            update.path,
            pathStyle,
            pathDelimiter,
        );
        if (segments === undefined) {
            continue;
        }
        current = setPathSegments(
            current,
            segments,
            update.value,
            prototypeKeys,
        ).result;
    }
    return current;
}

/**
 * Normalizes a record or an array of writes.
 *
 * @param updates - The caller-supplied writes.
 * @returns The writes in application order, or `undefined` when the value is neither form.
 */
function readUpdates(
    updates: unknown,
): readonly NormalizedUpdate[] | undefined {
    if (Array.isArray(updates)) {
        return readUpdateList(updates);
    }
    if (isPlainObjectValue(updates)) {
        return readUpdateRecord(updates);
    }
    return undefined;
}

/**
 * Reads array entries that own a path.
 *
 * @param updates - The array form.
 * @returns One update per usable entry, in order.
 */
function readUpdateList(updates: readonly unknown[]): NormalizedUpdate[] {
    const normalized: NormalizedUpdate[] = [];
    for (const update of updates) {
        const parsed = readUpdateEntry(update);
        if (parsed !== undefined) {
            normalized.push(parsed);
        }
    }
    return normalized;
}

/**
 * Reads a plain object's keys as path strings.
 *
 * @param updates - The record form.
 * @returns One update per enumerable string key, in key order.
 */
function readUpdateRecord(
    updates: Record<string, unknown>,
): NormalizedUpdate[] {
    const normalized: NormalizedUpdate[] = [];
    for (const key of Object.keys(updates)) {
        normalized.push({
            path: key,
            value: readOwnProperty(updates, key),
        });
    }
    return normalized;
}

/**
 * Reads one `{ path, value }` entry.
 *
 * @param update - One array entry.
 * @returns The entry, or `undefined` when it has no usable path.
 */
function readUpdateEntry(update: unknown): NormalizedUpdate | undefined {
    if (!isObjectLikeValue(update) || !Object.hasOwn(update, "path")) {
        return undefined;
    }
    const path = readOwnProperty(update, "path");
    if (!isObjectPath(path)) {
        return undefined;
    }
    const value = Object.hasOwn(update, "value")
        ? readOwnProperty(update, "value")
        : undefined;
    return { path, value };
}

/**
 * Whether `value` is a path this package can resolve.
 *
 * @param value - A candidate path.
 * @returns `true` for a string, a number, or an array of strings and numbers.
 */
function isObjectPath(value: unknown): value is ObjectPath {
    if (typeof value === "string" || typeof value === "number") {
        return true;
    }
    if (!Array.isArray(value)) {
        return false;
    }
    for (const segment of value) {
        if (typeof segment !== "string" && typeof segment !== "number") {
            return false;
        }
    }
    return true;
}
