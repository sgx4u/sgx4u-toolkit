import type { EntryMapper, MapEntriesParams } from "./map-entries.types.js";
import {
    assertFunction,
    describeReceived,
} from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const mapEntryFields = ["object", "mapper", "deep"] as const;

/**
 * Returned by a `mapEntries` mapper to drop that entry.
 *
 * The symbol is unique, so a mapped value that happens to be some other
 * symbol is kept.
 */
export const mapSkip: unique symbol = Symbol("mapSkip");

/**
 * Copies a plain object with entries replaced by `mapper`.
 *
 * `mapper` is called as `mapper(key, value, object)` and returns
 * `[newKey, newValue]` or `mapSkip`. When `deep` is true, nested plain
 * objects and objects inside arrays are mapped first, and that mapped
 * container is the `value` argument. A repeated reference stays shared. A
 * cycle points at the new object. Returning `mapSkip`, or a dangerous key,
 * drops the entry. When two entries share a key, the later one wins. The
 * input is not mutated. `null`, primitives, and arrays return `undefined`.
 *
 * @param params - The object, mapper, and depth flag.
 * @returns The new object, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `mapper` is not a function, or when it returns neither a pair nor `mapSkip`.
 * @example
 * mapEntries({
 *     object: { a: 1 },
 *     mapper: (key, value) => [key.toUpperCase(), value],
 * });
 */
export function mapEntries(
    params: MapEntriesParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", mapEntryFields)) {
        return undefined;
    }
    assertFunction(params.mapper, "mapper");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return mapEntryContainer(
        params.object,
        params.mapper as EntryMapper,
        params.deep === true,
        new WeakMap(),
    ) as Record<string, unknown>;
}

/**
 * Maps entries of one plain object or copies one array.
 *
 * @param source - A plain object or an array reached while mapping deeply.
 * @param mapper - The entry function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The new container.
 */
function mapEntryContainer(
    source: object,
    mapper: EntryMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): object {
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return mapEntryArray(source, mapper, deep, clones);
    }
    return mapEntryObject(source, mapper, deep, clones);
}

/**
 * Copies an array, mapping plain objects inside it when `deep` is true.
 *
 * @param source - The array being copied.
 * @param mapper - The entry function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function mapEntryArray(
    source: readonly unknown[],
    mapper: EntryMapper,
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
        copy[index] = mapEntryChild(source[index], mapper, deep, clones);
    }
    return copy;
}

/**
 * Copies a plain object and replaces each entry.
 *
 * @param source - The object being copied.
 * @param mapper - The entry function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 * @throws {TypeError} When `mapper` returns neither a pair nor `mapSkip`.
 */
function mapEntryObject(
    source: object,
    mapper: EntryMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const prepared = mapEntryChild(source[key], mapper, deep, clones);
        writeMappedEntry(result, mapper(key, prepared, source));
    }
    return result;
}

/**
 * Maps `value` when it is a nested container and `deep` is true.
 *
 * @param value - The property or element value.
 * @param mapper - The entry function.
 * @param deep - Whether nested containers are mapped.
 * @param clones - Containers already mapped during this call.
 * @returns The value passed to the parent mapper, or stored in an array.
 */
function mapEntryChild(
    value: unknown,
    mapper: EntryMapper,
    deep: boolean,
    clones: WeakMap<object, object>,
): unknown {
    if (!deep) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return mapEntryContainer(value, mapper, deep, clones);
    }
    return value;
}

/**
 * Writes one mapper result, or drops it.
 *
 * @param result - The dictionary being built. It is mutated.
 * @param mapped - The mapper return value.
 * @throws {TypeError} When `mapped` is neither a pair nor `mapSkip`.
 */
function writeMappedEntry(result: object, mapped: unknown): void {
    if (mapped === mapSkip) {
        return;
    }
    if (!isMappedPair(mapped)) {
        throw new TypeError(
            `\`mapper\` must return a [key, value] pair or mapSkip; received ${describeReceived(mapped)}.`,
        );
    }
    const key = mapped[0];
    writeOwnProperty(result, key, mapped[1], "skip");
}

/**
 * Whether `value` is a `[key, value]` pair.
 *
 * @param value - The mapper return value.
 * @returns `true` when the first element is a property key and a second element exists.
 */
function isMappedPair(
    value: unknown,
): value is readonly [PropertyKey, unknown] {
    if (!Array.isArray(value) || value.length < 2) {
        return false;
    }
    const key = value[0];
    return (
        typeof key === "string" ||
        typeof key === "number" ||
        typeof key === "symbol"
    );
}
