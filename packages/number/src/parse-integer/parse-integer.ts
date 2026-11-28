import { parsePlainNumber } from "../utils/parse-text.utils.js";

/**
 * Parses a finite integer with {@link parseNumber}. Fractions and other invalid input return `undefined`.
 *
 * @example
 * parseInteger("42");
 */
export function parseInteger(value: unknown): number | undefined {
    const parsed = parsePlainNumber(value);
    if (parsed === undefined || !Number.isInteger(parsed)) {
        return undefined;
    }
    return parsed;
}
