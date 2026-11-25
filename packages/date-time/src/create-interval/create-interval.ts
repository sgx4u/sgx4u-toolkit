import type { DateInput } from "../types/date-input.types.js";
import type { Interval } from "../types/interval.types.js";
import { readInterval } from "../utils/interval.utils.js";

/**
 * Builds a half-open interval.
 *
 * `start` equal to `end` is empty and valid.
 *
 * @param start - The first instant, included.
 * @param end - The instant where the interval stops, excluded.
 * @returns A new interval. The inputs are not mutated.
 * @throws {@link RangeError} When `end` is before `start` or either side is not a real date.
 * @example
 * createInterval("2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z").start.toISOString(); // "2026-01-01T00:00:00.000Z"
 */
export function createInterval(start: DateInput, end: DateInput): Interval {
    return readInterval({ start, end });
}
