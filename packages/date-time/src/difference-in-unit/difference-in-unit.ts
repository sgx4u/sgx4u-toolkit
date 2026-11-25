import type { DateInput } from "../types/date-input.types.js";
import type { TimeUnit } from "../types/time.types.js";
import { differenceInInstantUnit } from "../utils/arithmetic.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";
import { assertTimeUnit } from "../utils/unit.utils.js";
import type { DifferenceInUnitOptions } from "./difference-in-unit.types.js";

/**
 * Counts whole units from `earlier` to `later`.
 *
 * Calendar units are counted on the wall clock: the largest count that,
 * added to `earlier`, does not pass `later`. Clock units divide the
 * elapsed milliseconds. The result is negative when `later` is earlier.
 *
 * @param later - The end instant.
 * @param earlier - The start instant.
 * @param unit - The unit to count.
 * @param options - `rounding` defaults to `"truncate"`.
 * @returns The signed unit count.
 * @throws {@link TypeError} When a date or the unit has the wrong type.
 * @throws {@link RangeError} When a value is invalid.
 * @example
 * differenceInUnit("2026-03-01T00:00:00Z", "2026-01-31T00:00:00Z", "month", { timeZone: "UTC" }); // 1
 */
export function differenceInUnit(
    later: DateInput,
    earlier: DateInput,
    unit: TimeUnit,
    options?: DifferenceInUnitOptions,
): number {
    const rounding = options?.rounding ?? "truncate";
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
    const timeZone = resolveTimeZone(options?.timeZone);
    return differenceInInstantUnit(
        resolveDateInput(later, "later", timeZone).getTime(),
        resolveDateInput(earlier, "earlier", timeZone).getTime(),
        assertTimeUnit(unit),
        timeZone,
        rounding,
    );
}
