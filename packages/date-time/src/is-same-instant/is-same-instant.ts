import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";

/**
 * Fields for {@link isSameInstant}.
 */
export interface IsSameInstantParams {
    /**
     * The first date.
     */
    first: DateInput;
    /**
     * The second date.
     */
    second: DateInput;
}

/**
 * Reports whether two values are the same millisecond.
 *
 * @param params - `first` and `second` are the instants to compare.
 * @returns `true` when both instants match, or either value is not a real date.
 * @example
 * isSameInstant({ first: "2024-01-01T00:00:00Z", second: 0 }); // false
 */
export function isSameInstant({
    first,
    second,
}: IsSameInstantParams): boolean {
    const firstInstant = readDateInput(first);
    const secondInstant = readDateInput(second);
    if (firstInstant === undefined || secondInstant === undefined) {
        return false;
    }
    return firstInstant.getTime() === secondInstant.getTime();
}
