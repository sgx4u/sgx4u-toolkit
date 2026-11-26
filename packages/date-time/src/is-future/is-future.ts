import type { DateInput } from "../types/date-input.types.js";
import { readDateInput, resolveNow } from "../utils/date-input.utils.js";

/**
 * Fields for {@link isFuture}.
 */
export interface IsFutureParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * The instant to use instead of the current time.
     */
    now?: DateInput;
}

/**
 * Reports whether a date is strictly after now.
 *
 * @param params - `date` is required. `now` defaults to the current time.
 * @returns `true` when `date` is later than `now`.
 * @example
 * isFuture({ date: "2027-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" }); // true
 */
export function isFuture({ date, now }: IsFutureParams): boolean {
    const instant = readDateInput(date);
    if (instant === undefined) {
        return false;
    }
    const reference = now === undefined ? resolveNow(undefined) : readDateInput(now);
    if (reference === undefined) {
        return false;
    }
    return instant.getTime() > reference.getTime();
}