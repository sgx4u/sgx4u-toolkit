import { describe, expect, it } from "vitest";
import { getIntervalIntersection } from "../index.js";

describe("getIntervalIntersection", () => {
    it("returns the overlap of two half-open intervals", () => {
        const overlap = getIntervalIntersection({
            first: { start: new Date(0), end: new Date(10) },
            second: { start: new Date(5), end: new Date(15) },
        });
        expect(overlap?.start.getTime()).toBe(5);
        expect(overlap?.end.getTime()).toBe(10);
        const contained = getIntervalIntersection({
            first: { start: new Date(0), end: new Date(20) },
            second: { start: new Date(4), end: new Date(9) },
        });
        expect(contained?.start.getTime()).toBe(4);
        expect(contained?.end.getTime()).toBe(9);
    });

    it("treats a shared endpoint as no overlap and clips a year boundary", () => {
        expect(
            getIntervalIntersection({
                first: { start: new Date(0), end: new Date(5) },
                second: { start: new Date(5), end: new Date(10) },
            }),
        ).toBeUndefined();
        expect(
            getIntervalIntersection({
                first: {
                    start: new Date("2026-12-31T00:00:00Z"),
                    end: new Date("2027-01-02T00:00:00Z"),
                },
                second: {
                    start: new Date("2026-12-01T00:00:00Z"),
                    end: new Date("2027-01-01T00:00:00Z"),
                },
            })?.end.toISOString(),
        ).toBe("2027-01-01T00:00:00.000Z");
        expect(
            getIntervalIntersection({
                first: {
                    start: new Date("2024-02-28T00:00:00Z"),
                    end: new Date("2024-03-02T00:00:00Z"),
                },
                second: {
                    start: new Date("2024-02-29T00:00:00Z"),
                    end: new Date("2024-03-01T00:00:00Z"),
                },
            })?.start.toISOString(),
        ).toBe("2024-02-29T00:00:00.000Z");
    });

    it("throws when either side is not a valid interval", () => {
        expect(() =>
            getIntervalIntersection({
                first: null as never,
                second: { start: new Date(0), end: new Date(1) },
            }),
        ).toThrow(TypeError);
        expect(() =>
            getIntervalIntersection({
                first: { start: new Date(0), end: new Date(5) },
                second: { start: new Date(4), end: new Date(1) },
            }),
        ).toThrow(RangeError);
    });
});
