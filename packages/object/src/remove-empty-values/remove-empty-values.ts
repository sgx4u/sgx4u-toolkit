import { emptyValueNames } from "../constants/object-options.constants.js";
import type { EmptyValue } from "../types/object-config.types.js";
import {
    describeReceived,
    formatAllowedList,
} from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { RemoveEmptyValuesParams } from "./remove-empty-values.types.js";

const removeEmptyFields = ["object", "emptyValues", "deep"] as const;

interface RemoveState {
    kinds: ReadonlySet<EmptyValue>;
    deep: boolean;
}

/**
 * Copies a plain object or array without the selected empty values.
 *
 * Children are cleaned first when `deep` is true. A nested object or array is
 * dropped only when it is empty after that cleaning and `emptyObject` or
 * `emptyArray` is listed. Empty array elements are removed and later elements
 * shift. `nan` matches `Number.NaN` and does not match `0` or any other
 * number. Dangerous keys are skipped. A repeated reference stays shared, and
 * a cycle points at the new container. The input is not mutated. `null` and
 * primitives return `undefined`.
 *
 * @param params - The object and the empty-value options.
 * @returns The cleaned object or array, or `undefined` when `object` is neither.
 * @throws {RangeError} When `emptyValues` is not an array of known names.
 * @example
 * removeEmptyValues({ object: { id: 1, name: undefined } });
 */
export function removeEmptyValues(params: RemoveEmptyValuesParams): unknown {
    if (!isParameterRecord(params, "object", removeEmptyFields)) {
        return undefined;
    }
    const state = resolveRemoveState(params);
    if (!isPlainObjectValue(params.object) && !Array.isArray(params.object)) {
        return undefined;
    }
    return cleanContainer(params.object, state, new WeakMap());
}

/**
 * Reads removal options from a recognized parameter object.
 *
 * @param params - The options object.
 * @returns The kinds to drop and the depth flag.
 * @throws {RangeError} When `emptyValues` is not an array of known names.
 */
function resolveRemoveState(params: Record<string, unknown>): RemoveState {
    return {
        deep: params.deep !== false,
        kinds: new Set(readEmptyValues(params.emptyValues)),
    };
}

/**
 * Reads `emptyValues`.
 *
 * @param value - The option the caller passed.
 * @returns The selected kinds. An omitted option is `["undefined"]`.
 * @throws {RangeError} When `value` is present and is not an array of known names.
 */
function readEmptyValues(value: unknown): readonly EmptyValue[] {
    if (value === undefined) {
        return ["undefined"];
    }
    if (!Array.isArray(value)) {
        throw new RangeError(
            `\`emptyValues\` must be an array of ${formatAllowedList(emptyValueNames)}; received ${describeReceived(value)}.`,
        );
    }
    const selected: EmptyValue[] = [];
    for (const item of value) {
        selected.push(readEmptyValue(item));
    }
    return selected;
}

/**
 * Reads one empty-value name.
 *
 * @param value - One entry from `emptyValues`.
 * @returns The name.
 * @throws {RangeError} When `value` is not a known name.
 */
function readEmptyValue(value: unknown): EmptyValue {
    if (typeof value === "string" && isEmptyValueName(value)) {
        return value;
    }
    throw new RangeError(
        `\`emptyValues\` must list ${formatAllowedList(emptyValueNames)}; received ${describeReceived(value)}.`,
    );
}

/**
 * Whether `value` is one of {@link emptyValueNames}.
 *
 * @param value - Candidate text.
 * @returns `true` when `value` names an empty kind.
 */
function isEmptyValueName(value: string): value is EmptyValue {
    return emptyValueNames.some((name) => name === value);
}

/**
 * Cleans one plain object or array.
 *
 * @param source - The container being copied.
 * @param state - Removal options.
 * @param clones - Containers already cleaned during this call.
 * @returns The cleaned container.
 */
function cleanContainer(
    source: object,
    state: RemoveState,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return cleanArray(source, state, clones);
    }
    return cleanObject(source, state, clones);
}

/**
 * Copies an array without empty elements.
 *
 * @param source - The array being copied.
 * @param state - Removal options.
 * @param clones - Containers already cleaned during this call.
 * @returns A dense array. Kept holes are removed when `undefined` is empty.
 */
function cleanArray(
    source: readonly unknown[],
    state: RemoveState,
    clones: WeakMap<object, object>,
): unknown[] {
    const copy: unknown[] = [];
    clones.set(source, copy);
    for (let index = 0; index < source.length; index += 1) {
        const item = Object.hasOwn(source, index) ? source[index] : undefined;
        const cleaned = cleanChild(item, state, clones);
        if (!isEmptyItem(cleaned, state.kinds)) {
            copy.push(cleaned);
        }
    }
    return copy;
}

/**
 * Copies a plain object without empty properties.
 *
 * @param source - The object being copied.
 * @param state - Removal options.
 * @param clones - Containers already cleaned during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function cleanObject(
    source: object,
    state: RemoveState,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const cleaned = cleanChild(source[key], state, clones);
        if (isEmptyItem(cleaned, state.kinds)) {
            continue;
        }
        writeOwnProperty(result, key, cleaned, "skip");
    }
    return result;
}

/**
 * Cleans `value` when deep cleaning is enabled and `value` is a container.
 *
 * @param value - The property or element value.
 * @param state - Removal options.
 * @param clones - Containers already cleaned during this call.
 * @returns The value to test and store.
 */
function cleanChild(
    value: unknown,
    state: RemoveState,
    clones: WeakMap<object, object>,
): unknown {
    if (!state.deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return cleanContainer(value, state, clones);
    }
    return value;
}

/**
 * Whether `value` should be dropped.
 *
 * @param value - A cleaned value.
 * @param kinds - The selected empty kinds.
 * @returns `true` when `value` matches one of `kinds`.
 */
function isEmptyItem(value: unknown, kinds: ReadonlySet<EmptyValue>): boolean {
    if (kinds.has("undefined") && value === undefined) {
        return true;
    }
    if (kinds.has("null") && value === null) {
        return true;
    }
    if (kinds.has("emptyString") && value === "") {
        return true;
    }
    if (kinds.has("nan") && typeof value === "number" && Number.isNaN(value)) {
        return true;
    }
    if (kinds.has("emptyArray") && Array.isArray(value) && value.length === 0) {
        return true;
    }
    return (
        kinds.has("emptyObject") &&
        isPlainObjectValue(value) &&
        Object.keys(value).length === 0
    );
}
