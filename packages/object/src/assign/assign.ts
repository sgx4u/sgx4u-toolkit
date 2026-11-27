import {
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { AssignParams } from "./assign.types.js";

/**
 * Copies enumerable string keys into a new object.
 *
 * Later object-like items overwrite earlier keys. Arrays contribute their
 * index keys. Dangerous keys (`__proto__`, `prototype`, and `constructor`)
 * are skipped, so they cannot change `Object.prototype`. An empty list, or
 * a list made only of primitives, returns `{}`. The inputs are not mutated.
 *
 * @param params - The list of sources.
 * @returns The merged object, or `undefined` when `objects` is not an array.
 * @example
 * assign({ objects: [{ a: 1 }, { a: 2, b: 3 }] });
 */
export function assign(
    params: AssignParams,
): Record<string, unknown> | undefined {
    if (!isObjectLikeValue(params) || !Array.isArray(params.objects)) {
        return undefined;
    }
    const result: Record<string, unknown> = {};
    for (const item of params.objects) {
        if (!isObjectLikeValue(item)) {
            continue;
        }
        copyEnumerableKeys(result, item);
    }
    return result;
}

/**
 * Copies own enumerable string keys onto `target`.
 *
 * @param target - The object that receives the keys. It is mutated.
 * @param source - The object whose keys are copied. It is not mutated.
 */
function copyEnumerableKeys(
    target: Record<string, unknown>,
    source: object,
): void {
    for (const key of Object.keys(source)) {
        writeOwnProperty(target, key, readOwnProperty(source, key), "skip");
    }
}
