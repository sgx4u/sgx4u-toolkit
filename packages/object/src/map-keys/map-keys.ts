import type { KeyMapper, MapKeysParams } from "./map-keys.types.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const mapKeyFields = ["object", "mapper", "deep"] as const;

/**
 * Copies a plain object with keys replaced by `mapper`.
 *
 * `mapper` is called as `mapper(key, value, object)` with the original value.
 * The stored value is that same value when `deep` is false. When `deep` is
 * true, nested plain objects and objects inside arrays are mapped first, and
 * a repeated reference stays shared. A cycle points at the new object. A
 * mapped key of `"__proto__"`, `"prototype"`, or `"constructor"` is skipped.
 * When two keys map to the same name, the later value wins. The input is not
 * mutated. `null`, primitives, and arrays return `undefined`.
 *
 * @param params - The object, mapper, and depth flag.
 * @returns The new object, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `mapper` is not a function.
 * @example
 * mapKeys({ object: { a: 1 }, mapper: (key) => key.toUpperCase() });
 */
export function mapKeys(
    params: MapKeysParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", mapKeyFields)) {
        return undefined;
    }
    assertFunction(params.mapper, "mapper");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return mapKeyContainer(
        params.object,
        params.mapper as KeyMapper,
        params.deep === true,
        new WeakMap(),
    ) as Record<string, unknown>;
}

/**
 * Maps keys of one plain object or copies one array.
 *
 * The clone is registered before its children are mapped, so a cycle points
 * at the new container.
 *
 * @param source - A plain object or an array reached while mapping deeply.
 * @param mapper - The key function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The new container.
 */
function mapKeyContainer(
    source: object,
    mapper: KeyMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return mapKeyArray(source, mapper, deep, clones);
    }
    return mapKeyObject(source, mapper, deep, clones);
}

/**
 * Copies an array, mapping plain objects inside it when `deep` is true.
 *
 * @param source - The array being copied.
 * @param mapper - The key function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function mapKeyArray(
    source: readonly unknown[],
    mapper: KeyMapper,
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
        copy[index] = mapKeyChild(source[index], mapper, deep, clones);
    }
    return copy;
}

/**
 * Copies a plain object with mapped keys.
 *
 * @param source - The object being copied. A class instance yields an empty dictionary.
 * @param mapper - The key function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function mapKeyObject(
    source: object,
    mapper: KeyMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const value = source[key];
        const stored = mapKeyChild(value, mapper, deep, clones);
        writeOwnProperty(result, mapper(key, value, source), stored, "skip");
    }
    return result;
}

/**
 * Maps `value` when it is a nested container and `deep` is true.
 *
 * @param value - The property or element value.
 * @param mapper - The key function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The value stored in the copy.
 */
function mapKeyChild(
    value: unknown,
    mapper: KeyMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): unknown {
    if (!deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return mapKeyContainer(value, mapper, deep, clones);
    }
    return value;
}
