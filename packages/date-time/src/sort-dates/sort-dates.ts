import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { SortDatesParams } from "./sort-dates.types.js";

/**
 * Returns a new array of dates in time order.
 *
 * The input array is not sorted or changed. Equal instants keep their
 * original relative order.
 *
 * @param params - `dates` is required. `order` defaults to `"ascending"`.
 * @returns A new array of new `Date` objects, or `undefined` when `dates` is not an array or contains an unusable date.
 * @throws {@link RangeError} When `order` is not a known direction.
 * @example
 * sortDates({ dates: ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"] })?.map((date) => date.toISOString()); // ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"]
 */
export function sortDates({
    dates,
    order = "ascending",
}: SortDatesParams): Date[] | undefined {
    if (!Array.isArray(dates)) {
        return undefined;
    }
    if (order !== "ascending" && order !== "descending") {
        throw rangeError("order", `"ascending" or "descending"`, order);
    }
    const direction = order === "ascending" ? 1 : -1;
    const resolved: { date: Date; index: number }[] = [];
    for (const [index, value] of dates.entries()) {
        const date = readDateInput(value);
        if (date === undefined) {
            return undefined;
        }
        resolved.push({ date, index });
    }
    return resolved
        .sort((left, right) => {
            const difference = left.date.getTime() - right.date.getTime();
            if (difference === 0) {
                return left.index - right.index;
            }
            return difference * direction;
        })
        .map((entry) => new Date(entry.date.getTime()));
}