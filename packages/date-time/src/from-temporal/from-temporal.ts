import type { TemporalInstantLike } from "../types/temporal.types.js";
import { typeError } from "../utils/error.utils.js";

/**
 * Returns a `Date` from a Temporal instant or zoned date-time.
 *
 * Any object with a finite numeric `epochMilliseconds` qualifies. The
 * package does not depend on Temporal.
 *
 * @param value - An object with `epochMilliseconds`.
 * @returns A new `Date` at that instant.
 * @throws {@link TypeError} When `epochMilliseconds` is missing or not finite.
 * @example
 * fromTemporal({ epochMilliseconds: 0 }).toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromTemporal(value: TemporalInstantLike): Date {
    if (
        value === null ||
        typeof value !== "object" ||
        !Number.isFinite(value.epochMilliseconds)
    ) {
        throw typeError(
            "value",
            "an object with a finite epochMilliseconds",
            value,
        );
    }
    return new Date(value.epochMilliseconds);
}
