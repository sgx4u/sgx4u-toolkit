import type { DateInput } from "../types/date-input.types.js";
import { compareResolvedInstants } from "../utils/compare.utils.js";

/**
 * Reports whether two values are the same millisecond.
 *
 * @param first - The first date.
 * @param second - The second date.
 * @returns `true` when both instants match.
 * @throws {@link TypeError} When either value has the wrong type.
 * @throws {@link RangeError} When either value is not a real date.
 * @example
 * isSameInstant("2024-01-01T00:00:00Z", 0); // false
 */
export function isSameInstant(first: DateInput, second: DateInput): boolean {
    return compareResolvedInstants(first, second, "first", "second") === 0;
}
