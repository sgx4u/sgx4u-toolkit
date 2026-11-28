import { parsePlainNumber } from "../utils/parse-text.utils.js";

/**
 * Parses a finite number or a plain decimal string. Grouping separators, currency, and the words `NaN` and `Infinity` return `undefined`. See {@link parseLocaleNumber} for grouped text.
 *
 * @example
 * parseNumber("1e-3");
 */
export function parseNumber(value: unknown): number | undefined {
    return parsePlainNumber(value);
}
