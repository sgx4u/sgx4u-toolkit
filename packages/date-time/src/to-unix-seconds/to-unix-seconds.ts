import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";

/**
 * Returns whole seconds since the Unix epoch, rounded toward minus infinity.
 *
 * @param date - The instant to convert.
 * @returns The second count, or `undefined` when `date` is not a real date. Negative instants round toward more negative values.
 * @example
 * toUnixSeconds("1970-01-01T00:00:01.900Z"); // 1
 */
export function toUnixSeconds(date: DateInput): number | undefined {
    const resolved = readDateInput(date);
    if (resolved === undefined) {
        return undefined;
    }
    return Math.floor(resolved.getTime() / 1000);
}