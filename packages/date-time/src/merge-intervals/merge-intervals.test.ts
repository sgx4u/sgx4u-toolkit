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

describe("intervals", () => {
    it("merges touching intervals and subtracts a cut", () => {
        const first = createInterval(0, 10);
        const second = createInterval(10, 20);
        const merged = mergeIntervals([second, first]);
        expect(merged).toHaveLength(1);
        expect(merged[0]?.start.getTime()).toBe(0);
        expect(merged[0]?.end.getTime()).toBe(20);
        expect(doIntervalsOverlap(first, second)).toBe(false);
        expect(
            doIntervalsOverlap(first, second, { countTouchingAsOverlap: true }),
        ).toBe(true);
        expect(isWithinInterval(0, first)).toBe(true);
        expect(isWithinInterval(10, first)).toBe(false);
        expect(
            getIntervalIntersection(
                first,
                createInterval(5, 15),
            )?.start.getTime(),
        ).toBe(5);
        expect(subtractIntervals(first, [createInterval(2, 4)])).toHaveLength(
            2,
        );
        expect(isValidInterval({ start: new Date(0), end: new Date(0) })).toBe(
            true,
        );
        expect(() => createInterval(10, 0)).toThrow(RangeError);
        const original = [second, first];
        mergeIntervals(original);
        expect(original[0]).toBe(second);
    });
});
