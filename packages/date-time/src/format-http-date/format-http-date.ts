import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { formatHTTPDateText } from "../utils/http-date.utils.js";

/**
 * Formats a date as an HTTP IMF-fixdate in GMT.
 *
 * @param date - The instant to format.
 * @returns `Thu, 26 Nov 2026 22:00:00 GMT`, or `undefined` when `date` is not usable.
 * @example
 * formatHTTPDate("2026-11-26T22:00:00.000Z"); // "Thu, 26 Nov 2026 22:00:00 GMT"
 */
export function formatHTTPDate(date: DateInput): string | undefined {
    const resolved = readDateInput(date);
    if (resolved === undefined) {
        return undefined;
    }
    return formatHTTPDateText(resolved.getTime());
}
