import {
    copyArray,
    isArrayLikeValue,
    isIterableValue,
    isTypedArrayValue,
} from "../utils/array.utils.js";

/**
 * Copies an array-like or iterable value into a new dense array.
 *
 * A real array, a typed array, a string, another iterable, or an
 * array-like object is copied. Strings become characters. Generators and
 * `Set` values are iterables and are copied. Holes in an array or an
 * array-like object become `undefined`. `null`, `undefined`, functions,
 * and plain objects that are not array-like return `undefined`. The input
 * is not mutated, and a copied array is a new array.
 *
 * @param value - Any value.
 * @returns A new dense array, or `undefined` when `value` cannot be copied.
 * @example
 * toArray("text");
 */
export function toArray(value: unknown): unknown[] | undefined {
    if (value === null || value === undefined || typeof value === "function") {
        return undefined;
    }
    if (Array.isArray(value)) {
        return copyArray(value);
    }
    if (typeof value === "string") {
        return Array.from(value);
    }
    if (isTypedArrayValue(value) || isIterableValue(value)) {
        return Array.from(value as Iterable<unknown>);
    }
    if (isArrayLikeValue(value)) {
        return Array.from(value);
    }
    return undefined;
}
