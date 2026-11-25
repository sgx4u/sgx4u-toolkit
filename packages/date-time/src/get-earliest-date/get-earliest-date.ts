import type { DateInput } from "../types/date-input.types.js";
import { extremeDate } from "../utils/compare.utils.js";

/**
 * Returns the earliest date in a list.
 *
 * The input array is not reordered. An empty list returns `undefined`.
 *
 * @param dates - The dates to search.
 * @returns A new `Date` for the earliest instant, or `undefined` when `dates` is empty.
 * @throws {@link TypeError} When `dates` is not an array, or an entry has the wrong type.
 * @throws {@link RangeError} When an entry is not a real date.
 * @example
 * getEarliestDate(["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"])?.toISOString(); // "2024-01-01T00:00:00.000Z"
 */
export function getEarliestDate(dates: readonly DateInput[]): Date | undefined {
    return extremeDate(dates, "earliest");
}
