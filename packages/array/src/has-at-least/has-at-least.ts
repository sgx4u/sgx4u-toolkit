import type { HasAtLeastParams } from "./has-at-least.types.js";
import { readParams } from "../utils/params.utils.js";

/**
 * Reports whether an array has at least `count` items.
 *
 * `array.length >= count` decides the result. The array is not mutated.
 * A non-array `array`, a `count` that is not a finite number, and a
 * non-object argument all return `false`. This function does not throw.
 *
 * @param params - `array` and `count`. A non-object returns `false`.
 * @returns `true` when `array` is an array and its length is at least `count`.
 * @example
 * hasAtLeast({ array: [1, 2, 3], count: 2 });
 */
export function hasAtLeast(params: HasAtLeastParams): boolean;
/**
 * @param params - A value that is not a params object.
 * @returns `false` when `params` is not an object.
 */
export function hasAtLeast(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): false;
export function hasAtLeast(params: unknown): boolean {
    const parsed = readParams<HasAtLeastParams>(params);
    if (parsed === undefined) {
        return false;
    }
    if (!Array.isArray(parsed.array)) {
        return false;
    }
    if (typeof parsed.count !== "number" || !Number.isFinite(parsed.count)) {
        return false;
    }
    return parsed.array.length >= parsed.count;
}
