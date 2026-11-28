import { readStringCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { ReverseStringOptions } from "./reverse-string.types.js";

/**
 * Reverses `value` in the chosen unit.
 *
 * Graphemes stay intact, so a family emoji stays one cluster. The input is not changed.
 *
 * @param value - The text to reverse.
 * @returns The reversed string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `unit` is unknown.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * reverseString("ab");
 */
export function reverseString(value: string): string | undefined;
/** @param options - `value` and an optional `unit`. */
export function reverseString(
    options: ReverseStringOptions,
): string | undefined;
/** @param valueOrOptions - A string, or `value` plus `unit`. */
export function reverseString(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined) return undefined;
    return splitIntoUnits(resolved.value, resolved.options.unit)
        .reverse()
        .join("");
}
