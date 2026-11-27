import type { Direction, SortKey } from "../types/sort.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import { assertChoice, typeError } from "./errors.utils.js";
import { assertIteratee, resolveIteratee } from "./iteratee.utils.js";
import {
    assertLocale,
    createCollator,
    sortDirections,
    sortNullPlacements,
    sortSensitivities,
} from "./locale.utils.js";

export { sortDirections, sortNullPlacements, sortSensitivities };

/**
 * Locale and numeric options shared by sort and search.
 */
export interface SortDefaults {
    locale?: string | readonly string[] | undefined;
    numeric?: boolean | undefined;
    sensitivity?: "base" | "accent" | "case" | "variant" | undefined;
    nulls?: "first" | "last" | undefined;
    direction?: Direction | undefined;
}

/**
 * One key after defaults are filled in.
 *
 * `read` is called with the item, its index in the source array, and that
 * array. `createComparator` has no source array, so it passes index `0` and
 * a one-element array.
 */
export interface PreparedSortKey<Item> {
    read: (item: Item, index: number, array: readonly Item[]) => unknown;
    direction: Direction;
    nulls: "first" | "last";
    collator: Intl.Collator;
}

/**
 * Whether a sort key has no order of its own.
 *
 * `null`, `undefined`, and `NaN` use the `nulls` placement. `NaN` is
 * included because it does not compare as less than or greater than any
 * number.
 *
 * @param value - A key read from an item.
 * @returns `true` when the key should use the null placement.
 */
function isUnorderedKey(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === "number" && Number.isNaN(value))
    );
}

/**
 * Validates call-level sort options and returns them unchanged when valid.
 *
 * @param defaults - Options from the call or from `createArray`.
 * @returns The same options after checks.
 * @throws {@link RangeError} When a named option is not one of the allowed values.
 * @throws {@link TypeError} When `numeric` is not a boolean or `locale` has the wrong type.
 */
export function assertSortDefaults(defaults: SortDefaults): SortDefaults {
    assertChoice("direction", defaults.direction, sortDirections);
    assertChoice("sensitivity", defaults.sensitivity, sortSensitivities);
    assertChoice("nulls", defaults.nulls, sortNullPlacements);
    if (
        defaults.numeric !== undefined &&
        typeof defaults.numeric !== "boolean"
    ) {
        throw typeError("numeric", "a boolean", defaults.numeric);
    }
    assertLocale(defaults.locale);
    return defaults;
}

/**
 * Compares two keys that are already known to be ordered.
 *
 * Numbers and bigints use numeric order. Booleans use `false` then `true`.
 * Everything else is compared as text through `collator`.
 *
 * @param left - The left key.
 * @param right - The right key.
 * @param collator - The collator for this key.
 * @returns `-1`, `0`, or `1`.
 */
function compareOrdered(
    left: unknown,
    right: unknown,
    collator: Intl.Collator,
): -1 | 0 | 1 {
    if (typeof left === "number" && typeof right === "number") {
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    }
    if (typeof left === "bigint" && typeof right === "bigint") {
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    }
    if (typeof left === "boolean" && typeof right === "boolean") {
        if (left === right) {
            return 0;
        }
        return left ? 1 : -1;
    }
    const result = collator.compare(String(left), String(right));
    if (result < 0) {
        return -1;
    }
    if (result > 0) {
        return 1;
    }
    return 0;
}

/**
 * Compares two keys, applying null placement and direction.
 *
 * Direction flips ordered keys only. Null placement stays the same in both
 * directions, so `nulls: "last"` keeps nullish keys at the end of a
 * descending sort.
 *
 * @param left - The left key.
 * @param right - The right key.
 * @param direction - `"ascending"` or `"descending"`.
 * @param nulls - Where unordered keys go.
 * @param collator - The collator for ordered text.
 * @returns `-1`, `0`, or `1`.
 */
export function compareSortKeys(
    left: unknown,
    right: unknown,
    direction: Direction,
    nulls: "first" | "last",
    collator: Intl.Collator,
): -1 | 0 | 1 {
    const leftUnordered = isUnorderedKey(left);
    const rightUnordered = isUnorderedKey(right);
    if (leftUnordered || rightUnordered) {
        if (leftUnordered && rightUnordered) {
            return 0;
        }
        if (leftUnordered) {
            return nulls === "first" ? -1 : 1;
        }
        return nulls === "first" ? 1 : -1;
    }
    const comparison = compareOrdered(left, right, collator);
    if (direction === "ascending" || comparison === 0) {
        return comparison;
    }
    return comparison === -1 ? 1 : -1;
}

/**
 * Turns public sort keys into readers and collators.
 *
 * An empty key list is valid. A bare property key or function inherits the
 * call-level options.
 *
 * @param keys - The caller's keys.
 * @param defaults - Call-level options, already validated.
 * @returns One normalized key per input key.
 * @throws {@link TypeError} When `keys` is not an array or a key is not an iteratee.
 * @throws {@link RangeError} When a key names an unknown option.
 */
export function normalizeSortKeys<Item>(
    keys: readonly SortKey<Item>[],
    defaults: SortDefaults,
): PreparedSortKey<Item>[] {
    if (!Array.isArray(keys)) {
        throw typeError("keys", "an array", keys);
    }
    return keys.map((key) => normalizeOneKey(key, defaults));
}

/**
 * @param key - One public sort key.
 * @param defaults - Call-level options.
 * @returns The normalized key.
 */
function normalizeOneKey<Item>(
    key: SortKey<Item>,
    defaults: SortDefaults,
): PreparedSortKey<Item> {
    if (isBareIteratee(key)) {
        return {
            read: resolveIteratee(key),
            direction: defaults.direction ?? "ascending",
            nulls: defaults.nulls ?? "last",
            collator: createCollator(
                defaults.locale,
                defaults.numeric === true,
                defaults.sensitivity ?? "variant",
            ),
        };
    }
    if (key === null || typeof key !== "object") {
        throw typeError(
            "keys",
            "an array of property keys, functions, or key objects",
            key,
        );
    }
    const keyObject = key as {
        by?: unknown;
        direction?: unknown;
        locale?: unknown;
        numeric?: unknown;
        sensitivity?: unknown;
        nulls?: unknown;
    };
    assertIteratee("by", keyObject.by);
    assertChoice("direction", keyObject.direction, sortDirections);
    assertChoice("sensitivity", keyObject.sensitivity, sortSensitivities);
    assertChoice("nulls", keyObject.nulls, sortNullPlacements);
    if (
        keyObject.numeric !== undefined &&
        typeof keyObject.numeric !== "boolean"
    ) {
        throw typeError("numeric", "a boolean", keyObject.numeric);
    }
    const locale = resolveKeyLocale(keyObject.locale, defaults.locale);
    const numeric = keyObject.numeric ?? defaults.numeric === true;
    const sensitivity =
        (keyObject.sensitivity as SortDefaults["sensitivity"]) ??
        defaults.sensitivity ??
        "variant";
    return {
        read: resolveIteratee(keyObject.by as Iteratee<Item>),
        direction:
            (keyObject.direction as Direction | undefined) ??
            defaults.direction ??
            "ascending",
        nulls:
            (keyObject.nulls as "first" | "last" | undefined) ??
            defaults.nulls ??
            "last",
        collator: createCollator(locale, numeric === true, sensitivity),
    };
}

/**
 * A bare iteratee is a key or a function. An object is a key descriptor.
 *
 * A function is also an object in JavaScript, so functions are tested first.
 *
 * @param key - One public sort key.
 * @returns `true` when the key is not a descriptor object.
 */
function isBareIteratee<Item>(key: SortKey<Item>): key is Iteratee<Item> {
    if (
        typeof key === "function" ||
        typeof key === "string" ||
        typeof key === "symbol"
    ) {
        return true;
    }
    if (typeof key === "number") {
        return true;
    }
    return false;
}

/**
 * @param keyLocale - Locale on the key, when the caller set it.
 * @param defaultLocale - Call-level locale.
 * @returns The locale to construct.
 */
function resolveKeyLocale(
    keyLocale: unknown,
    defaultLocale: string | readonly string[] | undefined,
): string | readonly string[] | undefined {
    if (keyLocale === undefined) {
        return defaultLocale;
    }
    if (typeof keyLocale === "string") {
        return keyLocale;
    }
    if (
        Array.isArray(keyLocale) &&
        keyLocale.every((tag) => typeof tag === "string")
    ) {
        return keyLocale as readonly string[];
    }
    throw typeError(
        "locale",
        "a BCP 47 language tag or a list of tags",
        keyLocale,
    );
}

/**
 * Compares two items by normalized keys, left to right.
 *
 * Later keys are consulted only when earlier keys compare equal. The
 * iteratee receives the item, index `0`, and a one-element array, because a
 * pairwise comparator does not know the source array.
 *
 * @param keys - Normalized keys.
 * @returns A comparator for `Array#toSorted`.
 */
export function comparatorForKeys<Item>(
    keys: readonly PreparedSortKey<Item>[],
): (left: Item, right: Item) => -1 | 0 | 1 {
    return (left: Item, right: Item) => {
        for (const key of keys) {
            const leftValue = key.read(left, 0, [left]);
            const rightValue = key.read(right, 0, [right]);
            const comparison = compareSortKeys(
                leftValue,
                rightValue,
                key.direction,
                key.nulls,
                key.collator,
            );
            if (comparison !== 0) {
                return comparison;
            }
        }
        return 0;
    };
}

/**
 * Reads one search key from an item.
 *
 * When `by` is omitted, the item itself is the key. Index `0` and a
 * one-element array are passed to a function iteratee.
 *
 * @param by - An optional iteratee.
 * @returns A reader for items and for the searched value.
 */
export function searchKeyReader<Item>(
    by: Iteratee<Item> | undefined,
): (item: Item) => unknown {
    if (by === undefined) {
        return (item: Item) => item;
    }
    assertIteratee("by", by);
    const read = resolveIteratee(by);
    return (item: Item) => read(item, 0, [item]);
}

/**
 * A collator and null placement for search and natural sort of one key.
 *
 * @param defaults - Call-level options.
 * @param numeric - Whether this comparison is natural.
 * @returns Comparison pieces.
 */
/**
 * Compares two items at known indexes.
 *
 * @param left - The left item.
 * @param leftIndex - Index of `left` in `array`.
 * @param right - The right item.
 * @param rightIndex - Index of `right` in `array`.
 * @param array - The source array passed to iteratees.
 * @param keys - Keys from `normalizeSortKeys`.
 * @returns `-1`, `0`, or `1`.
 */
export function comparePreparedItems<Item>(
    left: Item,
    leftIndex: number,
    right: Item,
    rightIndex: number,
    array: readonly Item[],
    keys: readonly PreparedSortKey<Item>[],
): -1 | 0 | 1 {
    for (const key of keys) {
        const comparison = compareSortKeys(
            key.read(left, leftIndex, array),
            key.read(right, rightIndex, array),
            key.direction,
            key.nulls,
            key.collator,
        );
        if (comparison !== 0) {
            return comparison;
        }
    }
    return 0;
}

export function searchComparison(
    defaults: SortDefaults,
    numeric: boolean,
): {
    collator: Intl.Collator;
    nulls: "first" | "last";
    direction: Direction;
} {
    const validated = assertSortDefaults(defaults);
    return {
        collator: createCollator(
            validated.locale,
            numeric,
            validated.sensitivity ?? "variant",
        ),
        nulls: validated.nulls ?? "last",
        direction: validated.direction ?? "ascending",
    };
}
