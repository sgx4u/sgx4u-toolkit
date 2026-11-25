import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions } from "../types/options.types.js";
import { resolveDateInput, resolveNow } from "../utils/date-input.utils.js";

/**
 * Reports whether a date is strictly after now.
 *
 * @param date - The date to test.
 * @param options - `now` defaults to the current time.
 * @returns `true` when `date` is later than `now`.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isFuture("2027-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" }); // true
 */
export function isFuture(date: DateInput, options?: NowOptions): boolean {
    return (
        resolveDateInput(date, "date").getTime() >
        resolveNow(options?.now).getTime()
    );
}
