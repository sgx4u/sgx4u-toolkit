import type { TemporalInstantLike } from "../types/temporal.types.js";

/**
 * Returns a `Date` from a Temporal instant or zoned date-time.
 *
 * Any object with a finite numeric `epochMilliseconds` qualifies. The
 * package does not depend on Temporal.
 *
 * @param value - An object with `epochMilliseconds`.
 * @returns A new `Date` at that instant, or `undefined` when the value is not usable.
 * @example
 * fromTemporal({ epochMilliseconds: 0 })?.toISOString(); // "1970-01-01T00:00:00.000Z"
 */
export function fromTemporal(value: TemporalInstantLike): Date | undefined {
    if (
        value === null ||
        typeof value !== "object" ||
        !Number.isFinite(value.epochMilliseconds)
    ) {
        return undefined;
    }
    return new Date(value.epochMilliseconds);
}
