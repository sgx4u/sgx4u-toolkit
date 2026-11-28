import { parsePlainNumber } from "../utils/parse-text.utils.js";

/**
 * Parses a finite number from a number or a plain decimal string. This is the same acceptance rule as {@link parseNumber}.
 *
 * @example
 * parseFiniteNumber("8");
 */
export function parseFiniteNumber(value: unknown): number | undefined {
    return parsePlainNumber(value);
}
