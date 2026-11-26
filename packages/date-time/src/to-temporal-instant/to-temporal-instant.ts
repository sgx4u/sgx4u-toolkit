import type { DateInput } from "../types/date-input.types.js";
import type { TemporalInstant } from "../types/temporal.types.js";
import { readDateInput } from "../utils/date-input.utils.js";

/**
 * Returns a Temporal instant for a date.
 *
 * The call uses `globalThis.Temporal.Instant.fromEpochMilliseconds`. When
 * that global is missing it throws. The return type is a local interface
 * so the package compiles without Temporal's types.
 *
 * @param date - The instant to convert.
 * @returns The Temporal instant, or `undefined` when `date` is not a real date.
 * @throws {@link TypeError} When `Temporal` is not on the global object.
 * @example
 * toTemporalInstant(0)?.epochMilliseconds; // 0, when Temporal is present
 */
export function toTemporalInstant(
    date: DateInput,
): TemporalInstant | undefined {
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
    const resolved = readDateInput(date);
    if (resolved === undefined) {
        return undefined;
    }
    return temporal.Instant.fromEpochMilliseconds(resolved.getTime());
}