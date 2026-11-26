import { differenceInInstantUnit } from "../utils/arithmetic.utils.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { DifferenceInUnitParams } from "./difference-in-unit.types.js";

/**
 * Counts whole units from `earlier` to `later`.
 *
 * Calendar units are counted on the wall clock: the largest count that,
 * added to `earlier`, does not pass `later`. Clock units divide the
 * elapsed milliseconds. The result is negative when `later` is earlier.
 *
 * @param params - `later`, `earlier`, and `unit` are required. `rounding` defaults to `"truncate"`.
 * @returns The signed unit count, or `undefined` when either date is not usable.
 * @throws {@link TypeError} When `unit` is not a string.
 * @throws {@link RangeError} When `unit`, `rounding`, or `timeZone` is invalid.
 * @example
 * differenceInUnit({
 *   later: "2026-03-01T00:00:00Z",
 *   earlier: "2026-01-31T00:00:00Z",
 *   unit: "month",
 *   timeZone: "UTC",
 * }); // 1
 */
export function differenceInUnit({
    later,
    earlier,
    unit,
    timeZone,
    rounding = "truncate",
}: DifferenceInUnitParams): number | undefined {
    if (
        rounding !== "truncate" &&
        rounding !== "floor" &&
        rounding !== "ceil" &&
        rounding !== "round"
    ) {
        throw rangeError(
            "rounding",
            `"truncate", "floor", "ceil", or "round"`,
            rounding,
        );
    }
    const zone = resolveTimeZone(timeZone);
    const laterInstant = readDateInput(later, zone);
    const earlierInstant = readDateInput(earlier, zone);
    if (laterInstant === undefined || earlierInstant === undefined) {
        return undefined;
    }
    return differenceInInstantUnit(
        laterInstant.getTime(),
        earlierInstant.getTime(),
        assertTimeUnit(unit),
        zone,
        rounding,
    );
}
