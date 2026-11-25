import type { DateInput } from "../types/date-input.types.js";
import { compareResolvedInstants } from "../utils/compare.utils.js";

/**
 * Compares two dates for `Array#sort`.
 *
 * @param first - The first date.
 * @param second - The second date.
 * @returns `-1` when `first` is earlier, `1` when it is later, and `0` when the instants match.
 * @throws {@link TypeError} When either value has the wrong type.
 * @throws {@link RangeError} When either value is not a real date.
 * @example
 * compareDates("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"); // 1
 */
export function compareDates(first: DateInput, second: DateInput): -1 | 0 | 1 {
    return compareResolvedInstants(first, second, "first", "second");
}
