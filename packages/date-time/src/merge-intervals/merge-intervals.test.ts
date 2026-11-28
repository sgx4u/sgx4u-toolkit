import { describe, expect, it } from "vitest";
import {
    createInterval,
    doIntervalsOverlap,
    getIntervalIntersection,
    isValidInterval,
    isWithinInterval,
    mergeIntervals,
    subtractIntervals,
} from "../index.js";
import type { Interval } from "../types/interval.types.js";

function interval(start: number, end: number): Interval {
    const value = createInterval({ start, end });
    if (value === undefined) {
        throw new Error("expected an interval");
    }
    return value;
}

describe("intervals", () => {
    it("merges touching intervals and subtracts a cut", () => {
        const first = interval(0, 10);
        const second = interval(10, 20);
        const merged = mergeIntervals({ intervals: [second, first] });
        expect(merged)?.toHaveLength(1);
        expect(merged?.[0]?.start.getTime()).toBe(0);
        expect(merged?.[0]?.end.getTime()).toBe(20);
        expect(doIntervalsOverlap({ first, second })).toBe(false);
        expect(
            doIntervalsOverlap({
                first,
                second,
                countTouchingAsOverlap: true,
            }),
        ).toBe(true);
        expect(isWithinInterval({ date: 0, interval: first })).toBe(true);
        expect(isWithinInterval({ date: 10, interval: first })).toBe(false);
        expect(
            getIntervalIntersection({
                first,
                second: interval(5, 15),
            })?.start.getTime(),
        ).toBe(5);
        expect(
            subtractIntervals({
                start: first.start,
                end: first.end,
                removed: [interval(2, 4)],
            }),
        )?.toHaveLength(2);
        expect(isValidInterval({ start: new Date(0), end: new Date(0) })).toBe(
            true,
        );
        expect(createInterval({ start: 10, end: 0 })).toBeUndefined();
        const original = [second, first];
        mergeIntervals({ intervals: original });
        expect(original[0]).toBe(second);
    });
});
