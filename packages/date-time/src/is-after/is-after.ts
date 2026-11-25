import type { DateInput } from "../types/date-input.types.js";
import { compareResolvedInstants } from "../utils/compare.utils.js";

/**
 * Reports whether `date` is strictly later than `reference`.
 *
 * Equal instants return `false`.
 *
 * @param date - The date to test.
 * @param reference - The date to test against.
 * @returns `true` when `date` is later.
 * @throws {@link TypeError} When either value has the wrong type.
 * @throws {@link RangeError} When either value is not a real date.
 * @example
 * isAfter("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"); // true
 */
export function isAfter(date: DateInput, reference: DateInput): boolean {
    return compareResolvedInstants(date, reference, "date", "reference") > 0;
}
