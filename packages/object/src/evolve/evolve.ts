import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { EvolveParams } from "./evolve.types.js";

/**
 * Returns a copy of `object` with `transformations` applied by key.
 *
 * A function is called with the value at the same key. A nested plain object
 * evolves that key recursively. Keys that are not listed keep their original
 * references. A missing listed key is skipped. The inputs are not mutated.
 * When nothing changes, the same object is returned.
 *
 * @param params - The object and the transformations.
 * @returns The evolved object, or `undefined` when `object` is not plain.
 * @example
 * evolve({
 *     object: { name: "ada", address: { city: "paris" } },
 *     transformations: {
 *         name: (value) => String(value).toUpperCase(),
 *         address: { city: (value) => String(value).trim() },
 *     },
 * });
 */
export function evolve(
    params: EvolveParams,
): Record<string, unknown> | undefined {
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    if (!isPlainObjectValue(params.transformations)) {
        return params.object;
    }
    return evolvePlain(params.object, params.transformations);
}

/**
 * Evolves one plain object.
 *
 * @param object - The source object. It is not mutated.
 * @param transformations - Rules for this level.
 * @returns `object` when every listed key is unchanged, otherwise a new object.
 */
function evolvePlain(
    object: Record<string, unknown>,
    transformations: Record<string, unknown>,
): Record<string, unknown> {
    const result = createDictionary(object);
    let changed = false;
    for (const key of Object.keys(object)) {
        const current = readOwnProperty(object, key);
        const next = evolveProperty(
            current,
            Object.hasOwn(transformations, key)
                ? transformations[key]
                : undefined,
            Object.hasOwn(transformations, key),
        );
        if (!Object.is(next.value, current)) {
            changed = true;
        }
        writeOwnProperty(result, key, next.value, "keep");
    }
    if (!changed) {
        return object;
    }
    copyEnumerableSymbols(object, result);
    return result;
}

/**
 * Applies one rule to one property value.
 *
 * @param current - The current property value.
 * @param rule - The listed rule, when `listed` is true.
 * @param listed - Whether the key is present on the transformations object.
 * @returns The next property value.
 */
function evolveProperty(
    current: unknown,
    rule: unknown,
    listed: boolean,
): { value: unknown } {
    if (!listed) {
        return { value: current };
    }
    if (typeof rule === "function") {
        const apply = rule as (value: unknown) => unknown;
        return { value: apply(current) };
    }
    if (isPlainObjectValue(rule) && isPlainObjectValue(current)) {
        return { value: evolvePlain(current, rule) };
    }
    return { value: current };
}

/**
 * Copies enumerable symbol keys onto `target`.
 *
 * @param source - The object whose symbols are copied.
 * @param target - The object that receives them. It is mutated.
 * @returns Nothing.
 */
function copyEnumerableSymbols(source: object, target: object): void {
    for (const symbol of Object.getOwnPropertySymbols(source)) {
        const descriptor = Object.getOwnPropertyDescriptor(source, symbol);
        if (descriptor?.enumerable === true && "value" in descriptor) {
            writeOwnProperty(target, symbol, descriptor.value, "keep");
        }
    }
}
