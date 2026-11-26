import { describe, expect, it } from "vitest";
import { divideInterval, getIntervalGaps } from "../index.js";

describe("interval gaps and division", () => {
    it("finds the gap between two intervals and splits ten milliseconds in half", () => {
        const gaps = getIntervalGaps({
            intervals: [
                { start: new Date(0), end: new Date(5) },
                { start: new Date(10), end: new Date(15) },
            ],
        });
        expect(gaps?.[0]?.start.getTime()).toBe(5);
        expect(gaps?.[0]?.end.getTime()).toBe(10);
        expect(
            divideInterval({ start: new Date(0), end: new Date(10) }, 2).map(
                (part) => part.end.getTime(),
            ),
        ).toEqual([5, 10]);
        expect(() =>
            divideInterval({ start: new Date(0), end: new Date(10) }, 0),
        ).toThrow(RangeError);
    });

    it("throws when intervals is not an array", () => {
        expect(() =>
            getIntervalGaps({ intervals: null as never }),
        ).toThrow(TypeError);
    });
});