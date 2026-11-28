import type { MapValuesParams, ValueMapper } from "./map-values.types.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const mapValueFields = ["object", "mapper", "deep"] as const;

/**
 * Copies a plain object with values replaced by `mapper`.
 *
 * `mapper` is called as `mapper(value, key, object)`. When `deep` is true,
 * nested plain objects and objects inside arrays are mapped before the parent
 * mapper sees them. A repeated reference stays shared, and a cycle points at
 * the new object. Dangerous keys on the source are skipped. The input is not
 * mutated. `null`, primitives, and arrays return `undefined`.
 *
 * @param params - The object, mapper, and depth flag.
 * @returns The new object, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `mapper` is not a function.
 * @example
 * mapValues({ object: { a: 1 }, mapper: (value) => Number(value) + 1 });
 */
export function mapValues(
    params: MapValuesParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", mapValueFields)) {
        return undefined;
    }
    assertFunction(params.mapper, "mapper");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return mapValueContainer(
        params.object,
        params.mapper as ValueMapper,
        params.deep === true,
        new WeakMap(),
    ) as Record<string, unknown>;
}

/**
 * Maps values of one plain object or copies one array.
 *
 * @param source - A plain object or an array reached while mapping deeply.
 * @param mapper - The value function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The new container.
 */
function mapValueContainer(
    source: object,
    mapper: ValueMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return mapValueArray(source, mapper, deep, clones);
    }
    return mapValueObject(source, mapper, deep, clones);
}

/**
 * Copies an array, mapping plain objects inside it when `deep` is true.
 *
 * Array elements are not passed to `mapper`. Objects inside the array are.
 *
 * @param source - The array being copied.
 * @param mapper - The value function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function mapValueArray(
    source: readonly unknown[],
    mapper: ValueMapper,
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
        copy[index] = mapValueChild(source[index], mapper, deep, clones);
    }
    return copy;
}

/**
 * Copies a plain object and runs `mapper` on each stored value.
 *
 * @param source - The object being copied.
 * @param mapper - The value function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function mapValueObject(
    source: object,
    mapper: ValueMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const prepared = mapValueChild(source[key], mapper, deep, clones);
        writeOwnProperty(result, key, mapper(prepared, key, source), "skip");
    }
    return result;
}

/**
 * Maps `value` when it is a nested container and `deep` is true.
 *
 * @param value - The property or element value.
 * @param mapper - The value function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The value passed to the parent mapper, or stored in an array.
 */
function mapValueChild(
    value: unknown,
    mapper: ValueMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): unknown {
    if (!deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return mapValueContainer(value, mapper, deep, clones);
    }
    return value;
}
