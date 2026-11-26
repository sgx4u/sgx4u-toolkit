import { readDateInput } from "../utils/date-input.utils.js";
import type { CompareDatesParams } from "./compare-dates.types.js";

/**
 * Compares two instants.
 *
 * @param params - `first` and `second` are the instants to order.
 * @returns `-1` when `first` is earlier, `1` when it is later, `0` when they match, or `undefined` when either value is not a real date.
 * @example
 * compareDates({
 *   first: "2024-01-02T00:00:00Z",
 *   second: "2024-01-01T00:00:00Z",
 * }); // 1
 */
export function compareDates({
    first,
    second,
}: CompareDatesParams): -1 | 0 | 1 | undefined {
    const firstTime = readDateInput(first)?.getTime();
    const secondTime = readDateInput(second)?.getTime();
    if (firstTime === undefined || secondTime === undefined) {
        return undefined;
    }
    if (firstTime < secondTime) {
        return -1;
    }
    if (firstTime > secondTime) {
        return 1;
    }
    return 0;
}
