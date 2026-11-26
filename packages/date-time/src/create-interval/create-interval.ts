import type { Interval } from "../types/interval.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import type { CreateIntervalParams } from "./create-interval.types.js";

/**
 * Builds a half-open interval.
 *
 * `start` equal to `end` is empty and valid.
 *
 * @param params - Inclusive `start` and exclusive `end`.
 * @returns A new interval, or `undefined` when either side is not a real date or `end` is before `start`. The inputs are not mutated.
 * @example
 * createInterval({
 *   start: "2026-01-01T00:00:00Z",
 *   end: "2026-01-02T00:00:00Z",
 * })?.start.toISOString(); // "2026-01-01T00:00:00.000Z"
 */
export function createInterval({
    start,
    end,
}: CreateIntervalParams): Interval | undefined {
    const startDate = readDateInput(start);
    const endDate = readDateInput(end);
    if (startDate === undefined || endDate === undefined) {
        return undefined;
    }
    if (endDate.getTime() < startDate.getTime()) {
        return undefined;
    }
    return { start: startDate, end: endDate };
}