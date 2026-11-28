import type { Interval } from "../types/interval.types.js";
import { resolveDateInput } from "./date-input.utils.js";
import { rangeError, typeError } from "./error.utils.js";

/**
 * Checks an interval and returns new dates for both ends.
 *
 * @param value - A candidate interval.
 * @param argumentName - The parameter name used in an error.
 * @returns A new interval with the same instants.
 * @throws {@link TypeError} When `value` is not an object with start and end.
 * @throws {@link RangeError} When an end is before its start or a side is not a real date.
 */
export function readInterval(
    value: unknown,
    argumentName = "interval",
): Interval {
    if (value === null || typeof value !== "object") {
        throw typeError(argumentName, "an interval", value);
    }
    const record = value as { start?: unknown; end?: unknown };
    const start = resolveDateInput(record.start, `${argumentName}.start`);
    const end = resolveDateInput(record.end, `${argumentName}.end`);
    if (end.getTime() < start.getTime()) {
        throw rangeError(
            argumentName,
            "an interval whose end is not before its start",
            value,
        );
    }
    return { start, end };
}

/**
 * Whether a value is a valid half-open interval.
 *
 * @param value - Any value.
 * @returns `true` when both sides are real dates and end is not before start.
 */
export function isIntervalValue(value: unknown): value is Interval {
    if (value === null || typeof value !== "object") {
        return false;
    }
    const record = value as { start?: unknown; end?: unknown };
    try {
        const start = resolveDateInput(record.start, "start");
        const end = resolveDateInput(record.end, "end");
        return end.getTime() >= start.getTime();
    } catch {
        return false;
    }
}

/**
 * Sorts intervals by start and joins overlaps.
 *
 * @param intervals - The intervals to combine. The array is not changed.
 * @param mergeTouching - Whether `[a, b)` and `[b, c)` become one interval.
 * @returns New intervals, sorted, with overlaps joined.
 */
export function mergeIntervalList(
    intervals: readonly Interval[],
    mergeTouching: boolean,
): Interval[] {
    const sorted = intervals
        .map((interval, index) =>
            readInterval(interval, `intervals[${String(index)}]`),
        )
        .sort((left, right) => left.start.getTime() - right.start.getTime());
    const merged: Interval[] = [];
    for (const interval of sorted) {
        const last = merged[merged.length - 1];
        if (last === undefined) {
            merged.push(interval);
            continue;
        }
        const overlaps = mergeTouching
            ? interval.start.getTime() <= last.end.getTime()
            : interval.start.getTime() < last.end.getTime();
        if (overlaps) {
            if (interval.end.getTime() > last.end.getTime()) {
                last.end = interval.end;
            }
            continue;
        }
        merged.push(interval);
    }
    return merged;
}

/**
 * The shared part of two intervals.
 *
 * @param first - The first interval.
 * @param second - The second interval.
 * @returns The overlap, or `undefined` when they do not overlap.
 */
export function intersectionOf(
    first: Interval,
    second: Interval,
): Interval | undefined {
    const start = Math.max(first.start.getTime(), second.start.getTime());
    const end = Math.min(first.end.getTime(), second.end.getTime());
    if (end <= start) {
        return undefined;
    }
    return { start: new Date(start), end: new Date(end) };
}

/**
 * Whether two half-open intervals overlap.
 *
 * @param first - The first interval.
 * @param second - The second interval.
 * @param countTouchingAsOverlap - Whether sharing an endpoint counts.
 * @returns `true` when they overlap.
 */
export function intervalsOverlap(
    first: Interval,
    second: Interval,
    countTouchingAsOverlap: boolean,
): boolean {
    if (countTouchingAsOverlap) {
        return (
            first.start.getTime() <= second.end.getTime() &&
            second.start.getTime() <= first.end.getTime()
        );
    }
    return (
        first.start.getTime() < second.end.getTime() &&
        second.start.getTime() < first.end.getTime()
    );
}

/**
 * Parts of `source` that are not covered by `removed`.
 *
 * @param source - The interval to cut.
 * @param removed - Intervals to take away.
 * @returns The remaining pieces, sorted, without empty intervals.
 */
export function subtractIntervalList(
    source: Interval,
    removed: readonly Interval[],
): Interval[] {
    const cuts = mergeIntervalList(removed, true);
    const pieces: Interval[] = [];
    let cursor = source.start.getTime();
    const end = source.end.getTime();
    for (const cut of cuts) {
        const cutStart = Math.max(cut.start.getTime(), source.start.getTime());
        const cutEnd = Math.min(cut.end.getTime(), end);
        if (cutEnd <= cursor) {
            continue;
        }
        if (cutStart > cursor) {
            pieces.push({ start: new Date(cursor), end: new Date(cutStart) });
        }
        cursor = Math.max(cursor, cutEnd);
    }
    if (cursor < end) {
        pieces.push({ start: new Date(cursor), end: new Date(end) });
    }
    return pieces;
}
