import type { Duration } from "../types/duration.types.js";
import { durationBetweenInstants } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { DifferenceAsDurationParams } from "./difference-as-duration.types.js";

/**
 * Breaks the distance from `earlier` to `later` into a duration.
 *
 * Adding the result to `earlier` with `addDuration` in the same zone
 * returns `later` when `smallestUnit` is `"millisecond"`. A smaller clock
 * unit may be fractional so the elapsed time still matches.
 *
 * @param params - `later` and `earlier` are the two instants. `largestUnit` defaults to `"year"` and `smallestUnit` to `"millisecond"`.
 * @returns The broken-down duration. Zero fields are omitted, or `undefined` when either date is not usable.
 * @throws {@link TypeError} When a unit is not a string.
 * @throws {@link RangeError} When a unit is unknown, or `smallestUnit` is larger than `largestUnit`.
 * @example
 * differenceAsDuration({
 *   later: "2026-01-01T01:00:00Z",
 *   earlier: "2026-01-01T00:00:00Z",
 *   timeZone: "UTC",
 * }); // { hours: 1 }
 */
export function differenceAsDuration({
    later,
    earlier,
    timeZone,
    largestUnit = "year",
    smallestUnit = "millisecond",
}: DifferenceAsDurationParams): Duration | undefined {
    const zone = resolveTimeZone(timeZone);
    const laterInstant = readDateInput(later, zone);
    const earlierInstant = readDateInput(earlier, zone);
    if (laterInstant === undefined || earlierInstant === undefined) {
        return undefined;
    }
    return durationBetweenInstants(
        laterInstant.getTime(),
        earlierInstant.getTime(),
        zone,
        assertTimeUnit(largestUnit),
        assertTimeUnit(smallestUnit),
    );
}
