import { cloneShallowValue } from "../utils/clone.utils.js";

/**
 * Copies `value` one level deep.
 *
 * Calls `cloneShallowValue`. Primitives, functions, `WeakMap`, and `WeakSet`
 * are returned as-is. Arrays, records, dates, and other containers are new
 * instances. Nested values are shared. The input is not mutated.
 *
 * @param value - The value to copy.
 * @returns The copy, or `value` when there is nothing to copy.
 * @example
 * clone({ id: 1 });
 */
export function clone<T>(value: T): T {
    return cloneShallowValue(value);
}
