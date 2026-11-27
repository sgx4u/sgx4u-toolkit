/**
 * Whether `value` is an array from this realm or another.
 *
 * `Array.isArray` accepts arrays from other realms. Typed arrays, strings,
 * and array-like objects are not arrays.
 *
 * @param value - Any value.
 * @returns `true` when `value` is an array.
 */
export function isRealArray(value: unknown): value is readonly unknown[] {
    return Array.isArray(value);
}

/**
 * Copies `array` into a new dense array.
 *
 * Holes become `undefined` elements. The input is not mutated.
 *
 * @param array - The source array.
 * @returns A new array of the same length.
 */
export function copyArray<Item>(array: readonly Item[]): Item[] {
    return Array.from(array);
}

/**
 * Reads one element, treating a hole as `undefined`.
 *
 * @param array - The source array.
 * @param index - A non-negative index that is in range.
 * @returns The element at `index`.
 */
export function readItem<Item>(array: readonly Item[], index: number): Item {
    return array[index] as Item;
}

/**
 * Whether `value` is a typed array.
 *
 * `DataView` is an `ArrayBuffer` view and is not a typed array. The
 * `DataView` check uses the brand string so a view from another realm is
 * still excluded.
 *
 * @param value - Any value.
 * @returns `true` for a typed array.
 */
export function isTypedArrayValue(value: unknown): boolean {
    return (
        ArrayBuffer.isView(value) &&
        Object.prototype.toString.call(value) !== "[object DataView]"
    );
}

const maximumArrayLength = Number.MAX_SAFE_INTEGER;

/**
 * Whether `value` has an array-like length.
 *
 * A length is valid when it is an integer from `0` through `2^53 - 1`.
 * Functions are excluded even when they have a `length`. `null` is
 * excluded. Strings are array-like.
 *
 * @param value - Any value.
 * @returns `true` when `value` is array-like.
 */
export function isArrayLikeValue(value: unknown): value is ArrayLike<unknown> {
    if (value === null || value === undefined || typeof value === "function") {
        return false;
    }
    const length = (value as { length?: unknown }).length;
    return (
        typeof length === "number" &&
        Number.isInteger(length) &&
        length >= 0 &&
        length <= maximumArrayLength
    );
}

/**
 * Whether `value` can be iterated.
 *
 * @param value - Any value.
 * @returns `true` when `value` has a `Symbol.iterator` function.
 */
export function isIterableValue(value: unknown): value is Iterable<unknown> {
    if (value === null || value === undefined || typeof value !== "object") {
        return false;
    }
    return (
        typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
        "function"
    );
}

/**
 * Resolves an element index.
 *
 * A negative index counts from the end. A non-integer, or an index outside
 * the array, returns `undefined`.
 *
 * @param index - The caller-supplied index.
 * @param length - The array length.
 * @returns The non-negative index, or `undefined`.
 */
export function resolveIndex(
    index: number,
    length: number,
): number | undefined {
    if (!Number.isInteger(index)) {
        return undefined;
    }
    const resolvedIndex = index < 0 ? length + index : index;
    if (resolvedIndex < 0 || resolvedIndex >= length) {
        return undefined;
    }
    return resolvedIndex;
}

/**
 * Resolves an insertion index.
 *
 * `length` is valid and means append. A negative index counts from the end.
 * A non-integer, or an index outside `0..length`, returns `undefined`.
 *
 * @param index - The caller-supplied index.
 * @param length - The array length.
 * @returns The insertion index, or `undefined`.
 */
export function resolveInsertIndex(
    index: number,
    length: number,
): number | undefined {
    if (!Number.isInteger(index)) {
        return undefined;
    }
    const resolvedIndex = index < 0 ? length + index : index;
    if (resolvedIndex < 0 || resolvedIndex > length) {
        return undefined;
    }
    return resolvedIndex;
}
