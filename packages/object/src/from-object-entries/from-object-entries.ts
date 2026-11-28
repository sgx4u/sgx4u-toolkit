import { writeOwnProperty } from "../utils/dangerous-key.utils.js";

/**
 * Builds an object from entries.
 *
 * Dangerous keys are skipped, so a `__proto__` entry cannot change
 * `Object.prototype`. A value that is not iterable returns `undefined`.
 * Number keys are stored as strings, matching `Object.fromEntries`.
 *
 * @param entries - Pairs of key and value.
 * @returns A new object, or `undefined` when `entries` is not iterable.
 * @example
 * fromObjectEntries([["id", 1], ["name", "Ada"]]);
 */
export function fromObjectEntries(
    entries: Iterable<readonly [PropertyKey, unknown]>,
): Record<string, unknown> | undefined {
    if (typeof entries === "string" || !isIterable(entries)) {
        return undefined;
    }
    const result: Record<string, unknown> = {};
    for (const entry of entries) {
        if (!isEntry(entry)) {
            continue;
        }
        const key = entry[0];
        writeOwnProperty(result, key, entry[1], "skip");
    }
    return result;
}

/**
 * Whether `value` is a key/value pair.
 *
 * @param value - One iterated item.
 * @returns `true` when the item has a property key and a value.
 */
function isEntry(value: unknown): value is readonly [PropertyKey, unknown] {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const pair = value as { 0?: unknown; 1?: unknown; length?: unknown };
    if (typeof pair.length === "number" && pair.length < 2) {
        return false;
    }
    return (
        typeof pair[0] === "string" ||
        typeof pair[0] === "number" ||
        typeof pair[0] === "symbol"
    );
}

/**
 * Whether `value` can be iterated.
 *
 * @param value - Any value.
 * @returns `true` when `value` has a function iterator.
 */
function isIterable(
    value: unknown,
): value is Iterable<readonly [PropertyKey, unknown]> {
    if (value === null || value === undefined) {
        return false;
    }
    if (typeof value !== "object" && typeof value !== "string") {
        return false;
    }
    return typeof (value as Iterable<unknown>)[Symbol.iterator] === "function";
}
