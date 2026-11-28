import type { PlainObject } from "../types/plain-object.types.js";

const typedArrayTags: ReadonlySet<string> = new Set([
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]",
    "[object Float16Array]",
    "[object BigInt64Array]",
    "[object BigUint64Array]",
]);

/**
 * The `Object.prototype.toString` tag of `value`.
 *
 * The tag follows the value's internal slot, including values created in
 * another realm.
 *
 * @param value - Any value.
 * @returns A tag such as `"[object Date]"`.
 */
export function valueTag(value: unknown): string {
    return Object.prototype.toString.call(value);
}

/**
 * Whether `value` is a non-null object.
 *
 * Functions are not object-like. Arrays and dates are.
 *
 * @param value - Any value.
 * @returns `true` when `typeof value === "object"` and `value` is not `null`.
 */
export function isObjectLikeValue(value: unknown): value is object {
    return typeof value === "object" && value !== null;
}

/**
 * Whether `value` is a plain object in this realm or another.
 *
 * A plain object was created by `Object` or `Object.create(null)`. The check
 * does not require `Object.prototype` from this realm. A class instance is
 * not plain, because its prototype is not the end of the chain.
 *
 * @param value - Any value.
 * @returns `true` for a plain object.
 */
export function isPlainObjectValue(value: unknown): value is PlainObject {
    if (!isObjectLikeValue(value) || valueTag(value) !== "[object Object]") {
        return false;
    }
    const prototype: object | null = Object.getPrototypeOf(value);
    if (prototype === null) {
        return true;
    }
    if (Object.getPrototypeOf(prototype) !== null) {
        return false;
    }
    if (!Object.hasOwn(prototype, "constructor")) {
        return false;
    }
    const constructor: unknown = (prototype as { constructor?: unknown })
        .constructor;
    return typeof constructor === "function" && constructor.name === "Object";
}

/**
 * Whether `value` is a `Map`, including a `Map` from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `Map`.
 */
export function isMapValue(value: unknown): value is Map<unknown, unknown> {
    return isObjectLikeValue(value) && valueTag(value) === "[object Map]";
}

/**
 * Whether `value` is a `Set`, including a `Set` from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `Set`.
 */
export function isSetValue(value: unknown): value is Set<unknown> {
    return isObjectLikeValue(value) && valueTag(value) === "[object Set]";
}

/**
 * Whether `value` is a `WeakMap`, including one from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `WeakMap`.
 */
export function isWeakMapValue(
    value: unknown,
): value is WeakMap<object, unknown> {
    return isObjectLikeValue(value) && valueTag(value) === "[object WeakMap]";
}

/**
 * Whether `value` is a `WeakSet`, including one from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `WeakSet`.
 */
export function isWeakSetValue(value: unknown): value is WeakSet<object> {
    return isObjectLikeValue(value) && valueTag(value) === "[object WeakSet]";
}

/**
 * Whether `value` is a `Date`, including one from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `Date`.
 */
export function isDateValue(value: unknown): value is Date {
    return isObjectLikeValue(value) && valueTag(value) === "[object Date]";
}

/**
 * Whether `value` is a `RegExp`, including one from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `RegExp`.
 */
export function isRegExpValue(value: unknown): value is RegExp {
    return isObjectLikeValue(value) && valueTag(value) === "[object RegExp]";
}

/**
 * Whether `value` is an `Error`, including one from another realm.
 *
 * @param value - Any value.
 * @returns `true` when the value is an `Error`.
 */
export function isErrorValue(value: unknown): value is Error {
    return isObjectLikeValue(value) && valueTag(value) === "[object Error]";
}

/**
 * Whether `value` is a `URL`.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `URL`.
 */
export function isURLValue(value: unknown): value is URL {
    return isObjectLikeValue(value) && valueTag(value) === "[object URL]";
}

/**
 * Whether `value` is a `URLSearchParams`.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `URLSearchParams`.
 */
export function isURLSearchParamsValue(
    value: unknown,
): value is URLSearchParams {
    return (
        isObjectLikeValue(value) &&
        valueTag(value) === "[object URLSearchParams]"
    );
}

/**
 * Whether `value` is an `ArrayBuffer`.
 *
 * @param value - Any value.
 * @returns `true` when the value is an `ArrayBuffer`.
 */
export function isArrayBufferValue(value: unknown): value is ArrayBuffer {
    return (
        isObjectLikeValue(value) && valueTag(value) === "[object ArrayBuffer]"
    );
}

/**
 * Whether `value` is a `DataView`.
 *
 * @param value - Any value.
 * @returns `true` when the value is a `DataView`.
 */
export function isDataViewValue(value: unknown): value is DataView {
    return isObjectLikeValue(value) && valueTag(value) === "[object DataView]";
}

/**
 * Whether `value` is a typed array.
 *
 * `DataView` is not a typed array. `Float16Array` is recognized when the
 * runtime has it.
 *
 * @param value - Any value.
 * @returns `true` when the value is a typed array.
 */
export function isTypedArrayValue(
    value: unknown,
): value is Exclude<ArrayBufferView, DataView> {
    return isObjectLikeValue(value) && typedArrayTags.has(valueTag(value));
}

/**
 * Whether `value` stores object children this package walks.
 *
 * Typed arrays, buffers, and views are leaves. Their bytes are not objects.
 *
 * @param value - A non-null object.
 * @returns `true` when the value should be treated as a leaf container.
 */
export function isBinaryContainer(value: object): boolean {
    return (
        isArrayBufferValue(value) ||
        isDataViewValue(value) ||
        isTypedArrayValue(value)
    );
}
