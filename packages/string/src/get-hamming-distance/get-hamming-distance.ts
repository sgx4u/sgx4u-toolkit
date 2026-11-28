import { hammingDistance } from "../utils/distance.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { GetHammingDistanceOptions } from "./get-hamming-distance.types.js";

/**
 * Returns the Hamming distance between two strings of equal length.
 *
 * Each position whose units differ costs 1. Different lengths return
 * `undefined`, as does a non-string input. Two empty strings have
 * distance 0. The inputs are not changed.
 *
 * @param options - The two strings and an optional unit.
 * @returns The number of differing positions, or `undefined` when the lengths differ or an input is not a string.
 * @throws {@link RangeError} When `unit` is not a known unit.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * getHammingDistance({ first: "kar", second: "kat" });
 */
export function getHammingDistance(
    options: GetHammingDistanceOptions,
): number | undefined {
    const resolved = readOptionsCall(options, readDistanceOptions);
    if (resolved === undefined) {
        return undefined;
    }
    const first = resolved.record.first;
    const second = resolved.record.second;
    if (typeof first !== "string" || typeof second !== "string") {
        return undefined;
    }
    return hammingDistance(
        splitIntoUnits(first, resolved.options.unit),
        splitIntoUnits(second, resolved.options.unit),
    );
}

/**
 * @param record - The options object.
 * @returns The checked unit.
 */
function readDistanceOptions(record: Record<string, unknown>): {
    unit: StringUnit;
} {
    return { unit: readUnit(record.unit) };
}
