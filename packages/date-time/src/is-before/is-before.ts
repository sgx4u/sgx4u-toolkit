import type { DateInput } from "../types/date-input.types.js";
import { compareResolvedInstants } from "../utils/compare.utils.js";

/**
 * Reports whether `date` is strictly earlier than `reference`.
 *
 * Equal instants return `false`. The function throws for a value that is
 * not a real date; it does not treat that value as "not before".
 *
 * @param date - The date to test.
 * @param reference - The date to test against.
 * @returns `true` when `date` is earlier.
 * @throws {@link TypeError} When either value has the wrong type.
 * @throws {@link RangeError} When either value is not a real date.
 * @example
 * isBefore("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"); // true
 */
export function isBefore(date: DateInput, reference: DateInput): boolean {
    return compareResolvedInstants(date, reference, "date", "reference") < 0;
}
