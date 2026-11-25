import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Returns whole seconds since the Unix epoch, rounded toward minus infinity.
 *
 * @param date - The instant to convert.
 * @returns The second count. Negative instants round toward more negative values.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * toUnixSeconds("1970-01-01T00:00:01.900Z"); // 1
 */
export function toUnixSeconds(date: DateInput): number {
    return Math.floor(resolveDateInput(date, "date").getTime() / 1000);
}
