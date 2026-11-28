import type { RenameKeysParams } from "./rename-keys.types.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const renameFields = ["object", "mapping", "deep"] as const;

/**
 * Copies a plain object, renaming keys listed in `mapping`.
 *
 * Keys that are not listed are copied. The same mapping is used at every
 * level when `deep` is true, including objects inside arrays. A repeated
 * reference stays shared, and a cycle points at the new object. When two keys
 * land on the same name, the later value wins. A dangerous target name is
 * skipped. The input is not mutated. `null`, primitives, and arrays return
 * `undefined`.
 *
 * @param params - The object, mapping, and depth flag.
 * @returns The renamed object, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `mapping` is not a plain object.
 * @example
 * renameKeys({ object: { a: 1 }, mapping: { a: "id" } });
 */
export function renameKeys(
    params: RenameKeysParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", renameFields)) {
        return undefined;
    }
    const mapping = readMapping(params.mapping);
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return renameContainer(
        params.object,
        mapping,
        params.deep === true,
        new WeakMap(),
    ) as Record<string, unknown>;
}

/**
 * Reads `mapping` after the options object has been recognized.
 *
 * @param value - The `mapping` property.
 * @returns The mapping object.
 * @throws {TypeError} When `value` is not a plain object.
 */
function readMapping(value: unknown): Readonly<Record<string, unknown>> {
    if (!isPlainObjectValue(value)) {
        throw new TypeError(
            `\`mapping\` must be a plain object; received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * Renames one plain object or copies one array.
 *
 * @param source - A plain object or an array reached while renaming deeply.
 * @param mapping - Old names to new names.
 * @param deep - Whether nested containers are renamed.
 * @param clones - Containers already renamed during this call.
 * @returns The new container.
 */
function renameContainer(
    source: object,
    mapping: Readonly<Record<string, unknown>>,
    deep: boolean,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return renameArray(source, mapping, deep, clones);
    }
    return renameObject(source, mapping, deep, clones);
}

/**
 * Copies an array, renaming plain objects inside it when `deep` is true.
 *
 * @param source - The array being copied.
 * @param mapping - Old names to new names.
 * @param deep - Whether nested containers are renamed.
 * @param clones - Containers already renamed during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function renameArray(
    source: readonly unknown[],
    mapping: Readonly<Record<string, unknown>>,
    deep: boolean,
    clones: WeakMap<object, object>,
): unknown[] {
    const copy: unknown[] = [];
    clones.set(source, copy);
    copy.length = source.length;
    for (let index = 0; index < source.length; index += 1) {
        if (!Object.hasOwn(source, index)) {
            continue;
        }
        copy[index] = renameChild(source[index], mapping, deep, clones);
    }
    return copy;
}

/**
 * Copies a plain object, applying `mapping` to each key.
 *
 * @param source - The object being copied.
 * @param mapping - Old names to new names.
 * @param deep - Whether nested containers are renamed.
 * @param clones - Containers already renamed during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function renameObject(
    source: object,
    mapping: Readonly<Record<string, unknown>>,
    deep: boolean,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const stored = renameChild(source[key], mapping, deep, clones);
        writeOwnProperty(result, renamedKey(mapping, key), stored, "skip");
    }
    return result;
}

/**
 * Renames `value` when it is a nested container and `deep` is true.
 *
 * @param value - The property or element value.
 * @param mapping - Old names to new names.
 * @param deep - Whether nested containers are renamed.
 * @param clones - Containers already renamed during this call.
 * @returns The value stored in the copy.
 */
function renameChild(
    value: unknown,
    mapping: Readonly<Record<string, unknown>>,
    deep: boolean,
    clones: WeakMap<object, object>,
): unknown {
    if (!deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return renameContainer(value, mapping, deep, clones);
    }
    return value;
}

/**
 * The name to use for `key`.
 *
 * @param mapping - Old names to new names.
 * @param key - The current key.
 * @returns The mapped name, or `key` when it is not listed or the target is not a property key.
 */
function renamedKey(
    mapping: Readonly<Record<string, unknown>>,
    key: string,
): PropertyKey {
    if (!Object.hasOwn(mapping, key)) {
        return key;
    }
    const target = mapping[key];
    if (
        typeof target === "string" ||
        typeof target === "number" ||
        typeof target === "symbol"
    ) {
        return target;
    }
    return key;
}
