/**
 * Reports whether `value` is an array with no items.
 *
 * Only a real array counts. A typed array, a string, an array-like
 * object, and any other value return `false`, including values whose
 * `length` is `0`. The value is not mutated. This function does not throw.
 *
 * @param value - Any value.
 * @returns `true` only when `value` is an array and its length is `0`.
 * @example
 * isEmptyArray([]);
 */
export function isEmptyArray(value: unknown): boolean {
    return Array.isArray(value) && value.length === 0;
}
