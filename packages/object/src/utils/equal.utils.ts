import type { PathSegment } from "../types/path.types.js";
import {
    isArrayBufferValue,
    isDataViewValue,
    isDateValue,
    isErrorValue,
    isMapValue,
    isObjectLikeValue,
    isRegExpValue,
    isSetValue,
    isTypedArrayValue,
    isURLSearchParamsValue,
    isURLValue,
    isWeakMapValue,
    isWeakSetValue,
    valueTag,
} from "./value-kind.utils.js";

/**
 * Options for a deep comparison.
 */
export interface EqualOptions {
    /** Compare symbol keys when true. */
    includeSymbols: boolean;
    /** Compare non-enumerable string keys when true. */
    includeNonEnumerable: boolean;
}

/**
 * Details passed to an equality comparator.
 */
export interface EqualVisit {
    /** The left value. */
    first: unknown;
    /** The right value. */
    second: unknown;
    /** The key or index being compared. Omitted at the root. */
    key?: PropertyKey;
    /** The path from the root. */
    path: PathSegment[];
}

/**
 * SameValueZero.
 *
 * `NaN` equals `NaN`. `+0` equals `-0`.
 *
 * @param first - The left primitive.
 * @param second - The right primitive.
 * @returns `true` when the values match under SameValueZero.
 */
export function sameValueZero(first: unknown, second: unknown): boolean {
    return first === second || (first !== first && second !== second);
}

/**
 * Deep equality.
 *
 * Property order does not matter. Array order does. Cycles are compared by
 * pairing each object once, so a cycle does not loop. The function does not
 * throw.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param options - Which keys participate.
 * @returns `true` when the values have the same structure.
 */
export function valuesAreEqual(
    first: unknown,
    second: unknown,
    options: EqualOptions,
): boolean {
    return equalNode(first, second, options, new WeakMap(), []);
}

/**
 * Shallow equality.
 *
 * Primitives use SameValueZero. Objects must share a tag. One level of own
 * enumerable keys is compared, and nested objects are compared by reference.
 * Dates compare by time value. Regular expressions compare by source and flags.
 * Maps and sets compare their entries by SameValueZero.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param includeSymbols - Whether symbol keys participate.
 * @returns `true` when the values match one level deep.
 */
export function valuesAreShallowEqual(
    first: unknown,
    second: unknown,
    includeSymbols: boolean,
): boolean {
    if (sameValueZero(first, second)) {
        return true;
    }
    if (!isObjectLikeValue(first) || !isObjectLikeValue(second)) {
        return false;
    }
    if (valueTag(first) !== valueTag(second)) {
        return false;
    }
    if (isDateValue(first) && isDateValue(second)) {
        return sameValueZero(first.getTime(), second.getTime());
    }
    if (isRegExpValue(first) && isRegExpValue(second)) {
        return first.source === second.source && first.flags === second.flags;
    }
    if (isArrayBufferValue(first) && isArrayBufferValue(second)) {
        return bytesEqual(new Uint8Array(first), new Uint8Array(second));
    }
    if (isTypedArrayValue(first) && isTypedArrayValue(second)) {
        return bytesEqual(viewBytes(first), viewBytes(second));
    }
    if (isMapValue(first) && isMapValue(second)) {
        return shallowEntriesEqual([...first], [...second]);
    }
    if (isSetValue(first) && isSetValue(second)) {
        return shallowEntriesEqual(
            [...first].map((entry) => [entry, true]),
            [...second].map((entry) => [entry, true]),
        );
    }
    return keysMatch(
        first,
        second,
        { includeNonEnumerable: false, includeSymbols },
        (left, right) => sameValueZero(left, right),
    );
}

/**
 * Deep equality with a comparator.
 *
 * A boolean from `comparator` is the result for that pair. `undefined` uses
 * the default rule. Cycles are still visited once.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param options - Which keys participate.
 * @param comparator - Optional override for a pair.
 * @returns `true` when the values match.
 */
export function valuesAreEqualWith(
    first: unknown,
    second: unknown,
    options: EqualOptions,
    comparator: (details: EqualVisit) => boolean | undefined,
): boolean {
    return equalNodeWith(
        first,
        second,
        options,
        comparator,
        new WeakMap(),
        [],
        undefined,
    );
}

/**
 * Compares one pair.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param options - Which keys participate.
 * @param seen - Pairs already assumed equal while their children are compared.
 * @param path - The path from the root.
 * @returns `true` when the pair matches.
 */
function equalNode(
    first: unknown,
    second: unknown,
    options: EqualOptions,
    seen: WeakMap<object, WeakMap<object, true>>,
    path: PathSegment[],
): boolean {
    return equalNodeWith(
        first,
        second,
        options,
        () => undefined,
        seen,
        path,
        undefined,
    );
}

/**
 * Compares one pair, asking `comparator` first.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param options - Which keys participate.
 * @param comparator - Returns a boolean to override the default, or `undefined` to continue.
 * @param seen - Pairs already assumed equal.
 * @param path - The path from the root.
 * @param key - The key that selected this pair.
 * @returns `true` when the pair matches.
 */
function equalNodeWith(
    first: unknown,
    second: unknown,
    options: EqualOptions,
    comparator: (details: EqualVisit) => boolean | undefined,
    seen: WeakMap<object, WeakMap<object, true>>,
    path: PathSegment[],
    key: PropertyKey | undefined,
): boolean {
    const details: EqualVisit = { first, path, second };
    if (key !== undefined) {
        details.key = key;
    }
    const compared = comparator(details);
    if (compared !== undefined) {
        return compared;
    }
    if (sameValueZero(first, second)) {
        return true;
    }
    if (!isObjectLikeValue(first) || !isObjectLikeValue(second)) {
        return false;
    }
    if (valueTag(first) !== valueTag(second)) {
        return false;
    }
    if (pairAlreadySeen(seen, first, second)) {
        return true;
    }
    if (isDateValue(first) && isDateValue(second)) {
        return sameValueZero(first.getTime(), second.getTime());
    }
    if (isRegExpValue(first) && isRegExpValue(second)) {
        return first.source === second.source && first.flags === second.flags;
    }
    if (isURLValue(first) && isURLValue(second)) {
        return first.href === second.href;
    }
    if (isURLSearchParamsValue(first) && isURLSearchParamsValue(second)) {
        return first.toString() === second.toString();
    }
    if (isWeakMapValue(first) || isWeakSetValue(first)) {
        return false;
    }
    if (isArrayBufferValue(first) && isArrayBufferValue(second)) {
        return bytesEqual(new Uint8Array(first), new Uint8Array(second));
    }
    if (isDataViewValue(first) && isDataViewValue(second)) {
        return bytesEqual(viewBytes(first), viewBytes(second));
    }
    if (isTypedArrayValue(first) && isTypedArrayValue(second)) {
        return bytesEqual(viewBytes(first), viewBytes(second));
    }
    if (isMapValue(first) && isMapValue(second)) {
        return mapsEqual(first, second, options, seen, path);
    }
    if (isSetValue(first) && isSetValue(second)) {
        return setsEqual(first, second, options, seen, path);
    }
    if (isErrorValue(first) && isErrorValue(second)) {
        if (first.name !== second.name || first.message !== second.message) {
            return false;
        }
        if (
            !equalNodeWith(
                (first as { cause?: unknown }).cause,
                (second as { cause?: unknown }).cause,
                options,
                comparator,
                seen,
                [...path, "cause"],
                "cause",
            )
        ) {
            return false;
        }
    }
    if (
        Array.isArray(first) &&
        Array.isArray(second) &&
        first.length !== second.length
    ) {
        return false;
    }
    return keysMatch(first, second, options, (left, right, property) =>
        equalNodeWith(
            left,
            right,
            options,
            comparator,
            seen,
            typeof property === "string" || typeof property === "number"
                ? [...path, property]
                : path,
            property,
        ),
    );
}

/**
 * Records a pair and reports whether it was already being compared.
 *
 * @param seen - Pair map.
 * @param first - The left object.
 * @param second - The right object.
 * @returns `true` when this pair is already on the stack.
 */
function pairAlreadySeen(
    seen: WeakMap<object, WeakMap<object, true>>,
    first: object,
    second: object,
): boolean {
    let partners = seen.get(first);
    if (partners === undefined) {
        partners = new WeakMap();
        seen.set(first, partners);
    }
    if (partners.has(second)) {
        return true;
    }
    partners.set(second, true);
    return false;
}

/**
 * Whether two objects have the same selected keys and matching values.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @param options - Which keys participate.
 * @param valuesMatch - Compares one pair of values.
 * @returns `true` when every selected key matches.
 */
function keysMatch(
    first: object,
    second: object,
    options: EqualOptions,
    valuesMatch: (left: unknown, right: unknown, key: PropertyKey) => boolean,
): boolean {
    const firstKeys = selectedKeys(first, options);
    const secondKeys = selectedKeys(second, options);
    if (firstKeys.length !== secondKeys.length) {
        return false;
    }
    const secondKeySet = new Set(secondKeys);
    for (const key of firstKeys) {
        if (!secondKeySet.has(key)) {
            return false;
        }
        const left = (first as Record<PropertyKey, unknown>)[key];
        const right = (second as Record<PropertyKey, unknown>)[key];
        if (!valuesMatch(left, right, key)) {
            return false;
        }
    }
    return true;
}

/**
 * Own keys selected by the equality options.
 *
 * @param value - The object to list.
 * @param options - Which keys participate.
 * @returns The keys. Array indexes are strings, matching `Object.keys`.
 */
function selectedKeys(value: object, options: EqualOptions): PropertyKey[] {
    const keys: PropertyKey[] = options.includeNonEnumerable
        ? Object.getOwnPropertyNames(value)
        : Object.keys(value);
    if (!options.includeSymbols) {
        return keys;
    }
    for (const symbol of Object.getOwnPropertySymbols(value)) {
        const descriptor = Object.getOwnPropertyDescriptor(value, symbol);
        if (options.includeNonEnumerable || descriptor?.enumerable === true) {
            keys.push(symbol);
        }
    }
    return keys;
}

/**
 * Whether two maps contain the same entries under deep equality.
 *
 * @param first - The left map.
 * @param second - The right map.
 * @param options - Which keys participate inside nested objects.
 * @param seen - Pair map.
 * @param path - The path of the map.
 * @returns `true` when every entry has a match.
 */
function mapsEqual(
    first: Map<unknown, unknown>,
    second: Map<unknown, unknown>,
    options: EqualOptions,
    seen: WeakMap<object, WeakMap<object, true>>,
    path: PathSegment[],
): boolean {
    if (first.size !== second.size) {
        return false;
    }
    const unused = [...second.entries()];
    for (const [key, value] of first) {
        const matchIndex = unused.findIndex(
            ([otherKey, otherValue]) =>
                equalNode(key, otherKey, options, seen, path) &&
                equalNode(value, otherValue, options, seen, path),
        );
        if (matchIndex < 0) {
            return false;
        }
        unused.splice(matchIndex, 1);
    }
    return true;
}

/**
 * Whether two sets contain the same values under deep equality.
 *
 * @param first - The left set.
 * @param second - The right set.
 * @param options - Which keys participate inside nested objects.
 * @param seen - Pair map.
 * @param path - The path of the set.
 * @returns `true` when every value has a match.
 */
function setsEqual(
    first: Set<unknown>,
    second: Set<unknown>,
    options: EqualOptions,
    seen: WeakMap<object, WeakMap<object, true>>,
    path: PathSegment[],
): boolean {
    if (first.size !== second.size) {
        return false;
    }
    const unused = [...second];
    for (const value of first) {
        const matchIndex = unused.findIndex((other) =>
            equalNode(value, other, options, seen, path),
        );
        if (matchIndex < 0) {
            return false;
        }
        unused.splice(matchIndex, 1);
    }
    return true;
}

/**
 * Whether two lists of pairs match under SameValueZero, order ignored.
 *
 * @param first - Left pairs.
 * @param second - Right pairs.
 * @returns `true` when the pairs match.
 */
function shallowEntriesEqual(
    first: readonly (readonly [unknown, unknown])[],
    second: readonly (readonly [unknown, unknown])[],
): boolean {
    if (first.length !== second.length) {
        return false;
    }
    const unused = [...second];
    for (const [key, value] of first) {
        const matchIndex = unused.findIndex(
            ([otherKey, otherValue]) =>
                sameValueZero(key, otherKey) &&
                sameValueZero(value, otherValue),
        );
        if (matchIndex < 0) {
            return false;
        }
        unused.splice(matchIndex, 1);
    }
    return true;
}

/**
 * Byte equality, including length.
 *
 * @param first - Left bytes.
 * @param second - Right bytes.
 * @returns `true` when the bytes match.
 */
function bytesEqual(
    first: ArrayLike<number>,
    second: ArrayLike<number>,
): boolean {
    if (first.length !== second.length) {
        return false;
    }
    for (let index = 0; index < first.length; index += 1) {
        if (first[index] !== second[index]) {
            return false;
        }
    }
    return true;
}

/**
 * The bytes a view exposes.
 *
 * @param value - A view or typed array.
 * @returns A `Uint8Array` over that range.
 */
function viewBytes(value: ArrayBufferView): Uint8Array {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
}
