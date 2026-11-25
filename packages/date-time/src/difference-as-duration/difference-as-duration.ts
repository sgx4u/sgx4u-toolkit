import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import { durationBetweenInstants } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { DifferenceAsDurationOptions } from "./difference-as-duration.types.js";

/**
 * Breaks the distance from `earlier` to `later` into a duration.
 *
 * Adding the result to `earlier` with `addDuration` in the same zone
 * returns `later` when `smallestUnit` is `"millisecond"`. A smaller clock
 * unit may be fractional so the elapsed time still matches.
 *
 * @param later - The end instant.
 * @param earlier - The start instant.
 * @param options - `largestUnit` defaults to `"year"` and `smallestUnit` to `"millisecond"`.
 * @returns The broken-down duration. Zero fields are omitted.
 * @throws {@link TypeError} When a date or a unit has the wrong type.
 * @throws {@link RangeError} When a value is invalid, or `smallestUnit` is larger than `largestUnit`.
 * @example
 * differenceAsDuration("2026-01-01T01:00:00Z", "2026-01-01T00:00:00Z", { timeZone: "UTC" }); // { hours: 1 }
 */
export function differenceAsDuration(
    later: DateInput,
    earlier: DateInput,
    options?: DifferenceAsDurationOptions,
): Duration {
    const timeZone = resolveTimeZone(options?.timeZone);
    return durationBetweenInstants(
        resolveDateInput(later, "later", timeZone).getTime(),
        resolveDateInput(earlier, "earlier", timeZone).getTime(),
        timeZone,
        assertTimeUnit(options?.largestUnit ?? "year"),
        assertTimeUnit(options?.smallestUnit ?? "millisecond"),
    );
}
