import type { DateInput } from "../types/date-input.types.js";
import type { TemporalInstant } from "../types/temporal.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";

/**
 * Returns a Temporal instant for a date.
 *
 * The call uses `globalThis.Temporal.Instant.fromEpochMilliseconds`. When
 * that global is missing it throws. The return type is a local interface
 * so the package compiles without Temporal's types.
 *
 * @param date - The instant to convert.
 * @returns The Temporal instant.
 * @throws {@link TypeError} When `Temporal` is not on the global object.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * toTemporalInstant(0).epochMilliseconds; // 0, when Temporal is present
 */
export function toTemporalInstant(date: DateInput): TemporalInstant {
    const temporal = (
        globalThis as {
            Temporal?: {
                Instant?: {
                    fromEpochMilliseconds: (
                        milliseconds: number,
                    ) => TemporalInstant;
                };
            };
        }
    ).Temporal;
    if (temporal?.Instant?.fromEpochMilliseconds === undefined) {
        throw new TypeError(
            "`Temporal` is not available on the global object; received undefined.",
        );
    }
    return temporal.Instant.fromEpochMilliseconds(
        resolveDateInput(date, "date").getTime(),
    );
}
