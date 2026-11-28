import type {
    KeyCompare,
    SortKeysParams,
    SortOrder,
} from "./sort-keys.types.js";
import {
    assertFunction,
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const sortFields = [
    "object",
    "deep",
    "locale",
    "numeric",
    "order",
    "compare",
] as const;

const sortOrderValues = ["ascending", "descending"] as const;

interface SortState {
    deep: boolean;
    compare: KeyCompare;
}

/**
 * Copies a plain object with its keys in sorted order.
 *
 * The default order is `localeCompare` with `{ numeric: true }`, so `"a2"`
 * comes before `"a10"`. Pass `locale` as a string or a list of locale names.
 * `order: "descending"` swaps the compare arguments. A custom `compare`
 * replaces that default. Arrays keep their element order; when `deep` is
 * true, plain objects inside them are sorted. A repeated reference stays
 * shared, and a cycle points at the new container. Dangerous keys are
 * skipped. The input is not mutated. `null` and primitives return `undefined`.
 *
 * @param params - The object and sort options.
 * @returns The sorted object or a copied array, or `undefined` when `object` is neither.
 * @throws {TypeError} When `compare` is present and is not a function.
 * @throws {RangeError} When `order` or `locale` is invalid.
 * @example
 * sortKeys({ object: { a10: 1, a2: 2 } });
 */
export function sortKeys(params: SortKeysParams): unknown {
    if (!isParameterRecord(params, "object", sortFields)) {
        return undefined;
    }
    const state = resolveSortState(params);
    if (!isPlainObjectValue(params.object) && !Array.isArray(params.object)) {
        return undefined;
    }
    return sortContainer(params.object, state, new WeakMap());
}

/**
 * Reads sort options from a recognized parameter object.
 *
 * @param params - The options object.
 * @returns The depth flag and the compare function.
 * @throws {TypeError} When `compare` is present and is not a function.
 * @throws {RangeError} When `order` or `locale` is invalid.
 */
function resolveSortState(params: Record<string, unknown>): SortState {
    const order = readChoice(
        params.order,
        "order",
        sortOrderValues,
        "ascending",
    );
    const compare = readCompare(params, order);
    return {
        compare,
        deep: params.deep !== false,
    };
}

/**
 * Builds the compare function, including the direction.
 *
 * @param params - The options object.
 * @param order - The validated direction.
 * @returns A compare function whose negative result puts the first argument first.
 * @throws {TypeError} When `compare` is present and is not a function.
 * @throws {RangeError} When `locale` is present and is not a string or a list of strings.
 */
function readCompare(
    params: Record<string, unknown>,
    order: SortOrder,
): KeyCompare {
    const base = Object.hasOwn(params, "compare")
        ? assertedCompare(params.compare)
        : defaultCompare(readLocale(params.locale), params.numeric !== false);
    if (order === "descending") {
        return (left: string, right: string) => base(right, left);
    }
    return base;
}

/**
 * Checks that a provided compare callback is a function.
 *
 * @param value - The `compare` property.
 * @returns The callback.
 * @throws {TypeError} When `value` is not a function.
 */
function assertedCompare(value: unknown): KeyCompare {
    assertFunction(value, "compare");
    return value as KeyCompare;
}

/**
 * Reads `locale`.
 *
 * @param value - The locale the caller passed.
 * @returns A string, a list of strings, or `undefined` when the option is omitted.
 * @throws {RangeError} When `value` is present and is not a string or a list of strings.
 */
function readLocale(value: unknown): string | readonly string[] | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        return value;
    }
    if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
    ) {
        return value as readonly string[];
    }
    throw new RangeError(
        `\`locale\` must be a string or an array of strings; received ${describeReceived(value)}.`,
    );
}

/**
 * The default string ordering.
 *
 * @param locale - Locales for `localeCompare`, or `undefined` for the runtime locale.
 * @param numeric - Whether digit runs compare as numbers.
 * @returns A compare function.
 */
function defaultCompare(
    locale: string | readonly string[] | undefined,
    numeric: boolean,
): KeyCompare {
    return (left: string, right: string) =>
        compareLocale(left, right, locale, numeric);
}

/**
 * Compares two keys with `localeCompare`.
 *
 * @param left - The first key.
 * @param right - The second key.
 * @param locale - Locales for `localeCompare`, or `undefined` for the runtime locale.
 * @param numeric - Whether digit runs compare as numbers.
 * @returns A negative number, zero, or a positive number.
 */
function compareLocale(
    left: string,
    right: string,
    locale: string | readonly string[] | undefined,
    numeric: boolean,
): number {
    if (locale === undefined) {
        return left.localeCompare(right, undefined, { numeric });
    }
    if (typeof locale === "string") {
        return left.localeCompare(right, locale, { numeric });
    }
    return left.localeCompare(right, [...locale], { numeric });
}

/**
 * Sorts one plain object or copies one array.
 *
 * @param source - The container being copied.
 * @param state - Sort options.
 * @param clones - Containers already sorted during this call.
 * @returns The new container.
 */
function sortContainer(
    source: object,
    state: SortState,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return sortArray(source, state, clones);
    }
    return sortObject(source, state, clones);
}

/**
 * Copies an array without reordering elements.
 *
 * @param source - The array being copied.
 * @param state - Sort options.
 * @param clones - Containers already sorted during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function sortArray(
    source: readonly unknown[],
    state: SortState,
    clones: WeakMap<object, object>,
): unknown[] {
    const copy: unknown[] = [];
    clones.set(source, copy);
    copy.length = source.length;
    for (let index = 0; index < source.length; index += 1) {
        if (!Object.hasOwn(source, index)) {
            continue;
        }
        copy[index] = sortChild(source[index], state, clones);
    }
    return copy;
}

/**
 * Copies a plain object with sorted keys.
 *
 * @param source - The object being copied.
 * @param state - Sort options.
 * @param clones - Containers already sorted during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function sortObject(
    source: object,
    state: SortState,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    const keys = Object.keys(source).sort(state.compare);
    for (const key of keys) {
        writeOwnProperty(
            result,
            key,
            sortChild(source[key], state, clones),
            "skip",
        );
    }
    return result;
}

/**
 * Sorts `value` when it is a nested container and `deep` is true.
 *
 * @param value - The property or element value.
 * @param state - Sort options.
 * @param clones - Containers already sorted during this call.
 * @returns The value stored in the copy.
 */
function sortChild(
    value: unknown,
    state: SortState,
    clones: WeakMap<object, object>,
): unknown {
    if (!state.deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return sortContainer(value, state, clones);
    }
    return value;
}
