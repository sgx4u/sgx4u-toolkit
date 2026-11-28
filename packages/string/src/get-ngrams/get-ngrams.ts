import { readInteger } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { GetNgramsOptions } from "./get-ngrams.types.js";

/**
 * Settings after defaults and checks have been applied.
 */
interface GetNgramsSettings {
    /** How many units each group contains. At least 1. */
    size: number;
    /** The unit used to split `value`. */
    unit: StringUnit;
}

/**
 * Returns overlapping groups of units from `value`.
 *
 * `"hello"` with size `2` is `["he", "el", "ll", "lo"]`. A size longer
 * than the text returns an empty array. The input is not changed.
 *
 * @param value - Text to slice. The size is `2`.
 * @returns The groups.
 * @example
 * getNgrams("hello");
 */
export function getNgrams(value: string): string[];
/**
 * @param options - The text, an optional size, and an optional unit.
 * @returns The groups, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `size` is below 1 or is not an integer, or `unit` is unknown.
 * @throws {@link TypeError} When `size` or `unit` has the wrong type.
 */
export function getNgrams(options: GetNgramsOptions): string[] | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The groups, or `undefined` when the text is not a string.
 */
export function getNgrams(valueOrOptions: unknown): string[] | undefined {
    const resolved = readStringCall(valueOrOptions, readNgramOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return buildNgrams(resolved.value, resolved.options);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The checked size and unit.
 */
function readNgramOptions(record: Record<string, unknown>): GetNgramsSettings {
    return {
        size: readInteger("size", record.size, 1, undefined, 2),
        unit: readUnit(record.unit),
    };
}

/**
 * @param value - The source text.
 * @param settings - Checked n-gram settings.
 * @returns A new array of groups.
 */
function buildNgrams(value: string, settings: GetNgramsSettings): string[] {
    const units = splitIntoUnits(value, settings.unit);
    if (settings.size > units.length) {
        return [];
    }
    const groups: string[] = [];
    for (let index = 0; index <= units.length - settings.size; index += 1) {
        groups.push(units.slice(index, index + settings.size).join(""));
    }
    return groups;
}
