import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { formatHttpDateText } from "../utils/http-date.utils.js";

/**
 * Formats a date as an HTTP IMF-fixdate in GMT.
 *
 * @param date - The instant to format.
 * @returns `Thu, 26 Nov 2026 22:00:00 GMT`.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * formatHttpDate("2026-11-26T22:00:00.000Z"); // "Thu, 26 Nov 2026 22:00:00 GMT"
 */
export function formatHttpDate(date: DateInput): string {
    return formatHttpDateText(resolveDateInput(date, "date").getTime());
}
