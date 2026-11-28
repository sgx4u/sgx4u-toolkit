import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import {
    arrayIndexFromSegment,
    canonicalInteger,
    resolvePathSegments,
} from "../utils/path-text.utils.js";
import {
    isBinaryContainer,
    isMapValue,
    isObjectLikeValue,
    isPlainObjectValue,
    isSetValue,
    isWeakMapValue,
    isWeakSetValue,
} from "../utils/value-kind.utils.js";
import type { PathSegment } from "../types/path.types.js";
import type { OmitPathsParams } from "./omit-paths.types.js";

/**
 * A removal at one node.
 *
 * `drop` is true when a plain object became empty and its parent should
 * leave the key out.
 */
interface PathRemoval {
    result: unknown;
    changed: boolean;
    drop: boolean;
}

/**
 * Returns a copy of `object` with the given paths removed.
 *
 * The walk copies only the ancestors of a removed path. Unchanged subtrees
 * keep their references. When no path is removed, the same object is
 * returned. The input is not mutated.
 *
 * A plain object that becomes empty is removed from its parent, and that
 * rule repeats, so `{ a: { b: { c: 1 } } }` without `a.b.c` becomes `{}`.
 * The root may be an empty object. An empty array is kept. When an array
 * element is removed, or a plain-object element becomes empty, the index is
 * spliced out and later items shift. A hole is preserved when it is not the
 * removed index.
 *
 * An empty path and an illegal path are ignored. Dangerous own keys that
 * stay on a copied object are written with `Object.defineProperty`. `null`,
 * primitives, and functions return `undefined`.
 *
 * @param params - The object, the paths, and the path options.
 * @returns The edited object, the same object when nothing was removed, or `undefined` when the input is not valid.
 * @throws {RangeError} When `pathStyle` is unknown or `pathDelimiter` is empty.
 * @example
 * omitPaths({ object: { a: { b: 1 }, c: 2 }, paths: ["a.b"] });
 */
export function omitPaths(params: OmitPathsParams): unknown {
    if (!isObjectLikeValue(params.object) || !Array.isArray(params.paths)) {
        return undefined;
    }
    const pathStyle = readChoice(
        params.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const pathDelimiter = readPathDelimiter(
        params.pathDelimiter,
        defaultPathDelimiter,
    );
    const parsed: PathSegment[][] = [];
    for (const path of params.paths) {
        const segments = resolvePathSegments(path, pathStyle, pathDelimiter);
        if (segments === undefined || segments.length === 0) {
            continue;
        }
        parsed.push(segments);
    }
    return removePaths(params.object, parsed).result;
}

/**
 * Removes `paths` from `value`.
 *
 * An empty path list returns `value`. Maps, sets, and binary containers are
 * left unchanged because a path key is not one of their entries.
 *
 * @param value - The current node.
 * @param paths - Paths relative to this node. Each path is non-empty.
 * @returns The edited node, and whether a parent should drop it.
 */
function removePaths(
    value: unknown,
    paths: readonly (readonly PathSegment[])[],
): PathRemoval {
    if (paths.length === 0) {
        return { result: value, changed: false, drop: false };
    }
    if (Array.isArray(value)) {
        return removeFromArray(value, paths);
    }
    if (isPropertyContainer(value)) {
        return removeFromRecord(value, paths);
    }
    return { result: value, changed: false, drop: false };
}

/**
 * Removes paths from an array.
 *
 * Index removals are applied from the highest index so a splice does not
 * change an index that is still waiting. Named properties on the array are
 * copied onto the result when the array itself changes.
 *
 * @param value - The source array. It is not mutated.
 * @param paths - Paths relative to this array.
 * @returns The edited array. `drop` is always false.
 */
function removeFromArray(
    value: readonly unknown[],
    paths: readonly (readonly PathSegment[])[],
): PathRemoval {
    const grouped = groupArrayPaths(paths);
    const copy = value.slice();
    let changed = false;
    for (const index of indexesDescending(grouped.indexes)) {
        const nested = grouped.indexes.get(index);
        if (nested === undefined || index >= copy.length) {
            continue;
        }
        if (removesWholeValue(nested)) {
            copy.splice(index, 1);
            changed = true;
            continue;
        }
        if (!Object.hasOwn(copy, index)) {
            continue;
        }
        const child = removePaths(copy[index], nested);
        if (child.drop) {
            copy.splice(index, 1);
            changed = true;
            continue;
        }
        if (child.changed) {
            copy[index] = child.result;
            changed = true;
        }
    }
    const extrasChanged = applyArrayExtras(value, copy, grouped.keys);
    if (!changed && !extrasChanged) {
        return { result: value, changed: false, drop: false };
    }
    return { result: copy, changed: true, drop: false };
}

/**
 * Removes paths from a property record.
 *
 * @param value - The source object. It is not mutated.
 * @param paths - Paths relative to this object.
 * @returns The edited object. `drop` is true when a plain object is left empty.
 */
function removeFromRecord(
    value: object,
    paths: readonly (readonly PathSegment[])[],
): PathRemoval {
    const grouped = groupRecordPaths(paths);
    let changed = false;
    const target = createDictionary(value);
    for (const key of Object.keys(value)) {
        const current = readOwnProperty(value, key);
        const nested = grouped.get(key);
        if (nested === undefined) {
            writeOwnProperty(target, key, current, "keep");
            continue;
        }
        if (removesWholeValue(nested)) {
            changed = true;
            continue;
        }
        const child = removePaths(current, nested);
        if (child.drop) {
            changed = true;
            continue;
        }
        if (child.changed) {
            changed = true;
            writeOwnProperty(target, key, child.result, "keep");
            continue;
        }
        writeOwnProperty(target, key, current, "keep");
    }
    if (!changed) {
        return { result: value, changed: false, drop: false };
    }
    return {
        result: target,
        changed: true,
        drop: becameEmptyPlainObject(value, target),
    };
}

/**
 * Whether `value` stores string keys that a path can remove.
 *
 * @param value - Any value.
 * @returns `true` for a plain object, a class instance, or a date.
 */
function isPropertyContainer(value: unknown): value is object {
    return (
        isObjectLikeValue(value) &&
        !Array.isArray(value) &&
        !isMapValue(value) &&
        !isSetValue(value) &&
        !isWeakMapValue(value) &&
        !isWeakSetValue(value) &&
        !isBinaryContainer(value)
    );
}

/**
 * Groups array paths by an index or by a named property.
 *
 * @param paths - Paths whose first segment selects the child.
 * @returns Index groups and named-property groups. The rest of each path is kept.
 */
function groupArrayPaths(paths: readonly (readonly PathSegment[])[]): {
    indexes: Map<number, PathSegment[][]>;
    keys: Map<string, PathSegment[][]>;
} {
    const indexes: Map<number, PathSegment[][]> = new Map();
    const keys: Map<string, PathSegment[][]> = new Map();
    for (const path of paths) {
        const head = path[0];
        if (head === undefined) {
            continue;
        }
        const rest = path.slice(1);
        const index = arrayIndexFromSegment(head);
        if (index !== undefined) {
            pushGrouped(indexes, index, rest);
            continue;
        }
        pushGrouped(keys, String(head), rest);
    }
    return { indexes, keys };
}

/**
 * Lists map keys from the highest number to the lowest.
 *
 * @param indexes - Index groups.
 * @returns The indexes, highest first.
 */
function indexesDescending(
    indexes: ReadonlyMap<number, PathSegment[][]>,
): number[] {
    const values: number[] = [];
    for (const index of indexes.keys()) {
        values.push(index);
    }
    values.sort(compareIndexDescending);
    return values;
}

/**
 * Whether one of the remaining paths removes this node.
 *
 * @param rests - Path tails. An empty tail removes the node.
 * @returns `true` when the node itself should be removed.
 */
function removesWholeValue(
    rests: readonly (readonly PathSegment[])[],
): boolean {
    for (const rest of rests) {
        if (rest.length === 0) {
            return true;
        }
    }
    return false;
}

/**
 * Copies or removes named properties on an array.
 *
 * Index keys below `source.length` are left to the index walk. The target
 * is a copy and receives the properties that remain.
 *
 * @param source - The original array.
 * @param target - The array copy. It is mutated.
 * @param keys - Named paths grouped by property.
 * @returns `true` when a named property was removed or edited.
 */
function applyArrayExtras(
    source: readonly unknown[],
    target: unknown[],
    keys: ReadonlyMap<string, PathSegment[][]>,
): boolean {
    let changed = false;
    for (const key of Object.keys(source)) {
        if (isArrayIndexKey(key, source.length)) {
            continue;
        }
        const current = readOwnProperty(source, key);
        const nested = keys.get(key);
        if (nested === undefined) {
            writeOwnProperty(target, key, current, "keep");
            continue;
        }
        if (removesWholeValue(nested)) {
            changed = true;
            continue;
        }
        const child = removePaths(current, nested);
        if (child.drop) {
            changed = true;
            continue;
        }
        if (child.changed) {
            changed = true;
            writeOwnProperty(target, key, child.result, "keep");
            continue;
        }
        writeOwnProperty(target, key, current, "keep");
    }
    return changed;
}

/**
 * Groups object paths by the string form of the first segment.
 *
 * @param paths - Paths whose first segment selects the child.
 * @returns The remaining segments for each key.
 */
function groupRecordPaths(
    paths: readonly (readonly PathSegment[])[],
): Map<string, PathSegment[][]> {
    const grouped: Map<string, PathSegment[][]> = new Map();
    for (const path of paths) {
        const head = path[0];
        if (head === undefined) {
            continue;
        }
        pushGrouped(grouped, String(head), path.slice(1));
    }
    return grouped;
}

/**
 * Whether a plain object lost every enumerable string key.
 *
 * A class instance is not dropped. The root caller ignores `drop`.
 *
 * @param source - The object before the removal.
 * @param target - The copied object.
 * @returns `true` when the parent should omit this object.
 */
function becameEmptyPlainObject(source: object, target: object): boolean {
    return isPlainObjectValue(source) && Object.keys(target).length === 0;
}

/**
 * Appends a path tail to a group, creating the group when needed.
 *
 * @param grouped - Groups keyed by the first segment.
 * @param key - The first segment.
 * @param rest - The segments after `key`.
 */
function pushGrouped<Key>(
    grouped: Map<Key, PathSegment[][]>,
    key: Key,
    rest: PathSegment[],
): void {
    const existing = grouped.get(key);
    if (existing === undefined) {
        grouped.set(key, [rest]);
        return;
    }
    existing.push(rest);
}

/**
 * Compares indexes so the larger one sorts first.
 *
 * @param left - An array index.
 * @param right - An array index.
 * @returns A sort delta.
 */
function compareIndexDescending(left: number, right: number): number {
    return right - left;
}

/**
 * Whether `key` is an index that the array walk already covers.
 *
 * @param key - An own enumerable name.
 * @param length - The array length before edits.
 * @returns `true` when `key` is a canonical index below `length`.
 */
function isArrayIndexKey(key: string, length: number): boolean {
    const index = canonicalInteger(key);
    return index !== undefined && index < length;
}
