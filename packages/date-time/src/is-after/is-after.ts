import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";

/**
 * Fields for {@link isAfter}.
 */
export interface IsAfterParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * The date to test against.
     */
    reference: DateInput;
}

/**
 * Reports whether `date` is strictly later than `reference`.
 *
 * Equal instants return `false`. A value that is not a real date returns
 * `false`.
 *
 * @param params - `date` is the instant to test and `reference` is the instant to test against.
 * @returns `true` when `date` is later.
 * @example
 * isAfter({ date: "2024-01-02T00:00:00Z", reference: "2024-01-01T00:00:00Z" }); // true
 */
export function isAfter({ date, reference }: IsAfterParams): boolean {
    const dateInstant = readDateInput(date);
    const referenceInstant = readDateInput(reference);
    if (dateInstant === undefined || referenceInstant === undefined) {
        return false;
    }
    return dateInstant.getTime() > referenceInstant.getTime();
}
