import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Returns the astronomical Julian Date of an instant.
 *
 * The conversion is `unixMilliseconds / 86400000 + 2440587.5`.
 *
 * @param date - The instant to convert.
 * @returns The Julian Date.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * toJulianDate(0); // 2440587.5
 */
export function toJulianDate(date: DateInput): number {
    return resolveDateInput(date, "date").getTime() / 86_400_000 + 2_440_587.5;
}
