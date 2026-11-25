import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import type { SortDatesOptions } from "./sort-dates.types.js";

/**
 * Returns a new array of dates in time order.
 *
 * The input array is not sorted or changed. Equal instants keep their
 * original relative order.
 *
 * @param dates - The dates to sort.
 * @param options - `order` defaults to `"ascending"`.
 * @returns A new array of new `Date` objects.
 * @throws {@link TypeError} When `dates` is not an array.
 * @throws {@link RangeError} When an entry is not a real date, or `order` is not a known direction.
 * @example
 * sortDates(["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"]).map((date) => date.toISOString()); // ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"]
 */
export function sortDates(
    dates: readonly DateInput[],
    options?: SortDatesOptions,
): Date[] {
    if (!Array.isArray(dates)) {
        throw typeError("dates", "an array of dates", dates);
    }
    const order = options?.order ?? "ascending";
    if (order !== "ascending" && order !== "descending") {
        throw rangeError("order", `"ascending" or "descending"`, order);
    }
    const direction = order === "ascending" ? 1 : -1;
    return dates
        .map((value, index) => ({
            date: resolveDateInput(value, `dates[${String(index)}]`),
            index,
        }))
        .sort((left, right) => {
            const difference = left.date.getTime() - right.date.getTime();
            if (difference === 0) {
                return left.index - right.index;
            }
            return difference * direction;
        })
        .map((entry) => entry.date);
}
