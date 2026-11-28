import { diceCoefficient } from "../utils/distance.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { GetDiceCoefficientOptions } from "./get-dice-coefficient.types.js";

/**
 * Returns the Sørensen–Dice coefficient of two strings, from 0 to 1.
 *
 * The score compares adjacent pairs of units. Two empty strings score 1.
 * A non-string input returns `undefined`. The inputs are not changed.
 *
 * @param options - The two strings and an optional unit.
 * @returns The coefficient, or `undefined` when either input is not a string.
 * @throws {@link RangeError} When `unit` is not a known unit.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * getDiceCoefficient({ first: "night", second: "nacht" });
 */
export function getDiceCoefficient(
    options: GetDiceCoefficientOptions,
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
    return diceCoefficient(
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
