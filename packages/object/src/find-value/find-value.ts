import type { PathSegment } from "../types/path.types.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { FindValueParams } from "./find-value.types.js";

interface FoundValue {
    value: unknown;
}

/**
 * Returns the first depth-first value that matches `predicate`.
 *
 * The root is tested first. Plain objects and arrays are walked. Other
 * objects are tested and not entered. A cycle is not entered again. The
 * input is not mutated.
 *
 * @param params - The value and the predicate.
 * @returns The matching value, or `undefined` when nothing matches.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * findValue({
 *     object: { user: { id: 1 } },
 *     predicate: (value) => value === 1,
 * });
 */
export function findValue(params: FindValueParams): unknown {
    assertFunction(params.predicate, "predicate");
    const found = searchValue(
        params.object,
        [],
        params.object,
        params.predicate,
        new Set(),
    );
    if (found === undefined) {
        return undefined;
    }
    return found.value;
}

/**
 * Tests one node, then its plain-object and array children.
 *
 * @param value - The current value.
 * @param path - Segments from the root.
 * @param root - The value passed to `findValue`.
 * @param predicate - The caller's predicate.
 * @param ancestors - Objects on the path from the root.
 * @returns The match, or `undefined` when this subtree has none.
 */
function searchValue(
    value: unknown,
    path: readonly PathSegment[],
    root: unknown,
    predicate: FindValueParams["predicate"],
    ancestors: Set<object>,
): FoundValue | undefined {
    if (isObjectLikeValue(value) && ancestors.has(value)) {
        return undefined;
    }
    if (predicate(value, path, root)) {
        return { value };
    }
    if (!isObjectLikeValue(value)) {
        return undefined;
    }
    if (!Array.isArray(value) && !isPlainObjectValue(value)) {
        return undefined;
    }
    ancestors.add(value);
    const found = searchValueChildren(value, path, root, predicate, ancestors);
    ancestors.delete(value);
    return found;
}

/**
 * Searches the children of a plain object or an array.
 *
 * @param value - The parent container.
 * @param path - The parent path.
 * @param root - The value passed to `findValue`.
 * @param predicate - The caller's predicate.
 * @param ancestors - Objects on the path from the root.
 * @returns The match, or `undefined` when no child matches.
 */
function searchValueChildren(
    value: object,
    path: readonly PathSegment[],
    root: unknown,
    predicate: FindValueParams["predicate"],
    ancestors: Set<object>,
): FoundValue | undefined {
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
            if (!Object.hasOwn(value, index)) {
                continue;
            }
            const found = searchValue(
                value[index],
                [...path, index],
                root,
                predicate,
                ancestors,
            );
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }
    for (const key of Object.keys(value)) {
        const found = searchValue(
            readOwnProperty(value, key),
            [...path, key],
            root,
            predicate,
            ancestors,
        );
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
