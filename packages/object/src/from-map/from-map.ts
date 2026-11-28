import { writeOwnProperty } from "../utils/dangerous-key.utils.js";
import { isMapValue } from "../utils/value-kind.utils.js";

/**
 * Copies a `Map` into a plain object.
 *
 * String keys are copied. Symbol keys are copied. Number keys and every
 * other key are skipped. `__proto__`, `prototype`, and `constructor` are
 * skipped, so they cannot change `Object.prototype`. A value that is not a
 * `Map` returns `undefined`.
 *
 * @param map - Any value.
 * @returns A plain object, or `undefined` when `map` is not a `Map`.
 * @example
 * fromMap(new Map([["id", 1]]));
 */
export function fromMap(map: unknown): Record<string, unknown> | undefined {
    if (!isMapValue(map)) {
        return undefined;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of map) {
        if (typeof key !== "string" && typeof key !== "symbol") {
            continue;
        }
        writeOwnProperty(result, key, value, "skip");
    }
    return result;
}
