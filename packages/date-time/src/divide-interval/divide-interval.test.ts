import { describe, expect, it } from "vitest";
import { divideInterval } from "../index.js";

describe("divideInterval", () => {
    it("splits ten milliseconds into two equal parts", () => {
        expect(
            divideInterval({
                interval: { start: new Date(0), end: new Date(10) },
                partCount: 2,
            })?.map((part) => [part.start.getTime(), part.end.getTime()]),
        ).toEqual([
            [0, 5],
            [5, 10],
        ]);
    });

    it("gives the extra milliseconds to the earlier parts and splits a leap day in half", () => {
        expect(
            divideInterval({
                interval: { start: new Date(0), end: new Date(10) },
                partCount: 3,
            })?.map((part) => [part.start.getTime(), part.end.getTime()]),
        ).toEqual([
            [0, 4],
            [4, 7],
            [7, 10],
        ]);
        const leapDay = divideInterval({
            interval: {
                start: new Date("2024-02-29T00:00:00Z"),
                end: new Date("2024-03-01T00:00:00Z"),
            },
            partCount: 2,
        });
        expect(leapDay?.map((part) => part.end.toISOString())).toEqual([
            "2024-02-29T12:00:00.000Z",
            "2024-03-01T00:00:00.000Z",
        ]);
        const yearBoundary = divideInterval({
            interval: {
                start: new Date("2024-12-31T00:00:00Z"),
                end: new Date("2025-01-01T00:00:00Z"),
            },
            partCount: 1,
        });
        expect(yearBoundary?.[0]?.start.toISOString()).toBe(
            "2024-12-31T00:00:00.000Z",
        );
        expect(yearBoundary?.[0]?.end.toISOString()).toBe(
            "2025-01-01T00:00:00.000Z",
        );
        const empty = divideInterval({
            interval: { start: new Date(5), end: new Date(5) },
            partCount: 2,
        });
        expect(empty?.map((part) => part.start.getTime())).toEqual([5, 5]);
        expect(
            empty?.every((part) => part.start.getTime() === part.end.getTime()),
        ).toBe(true);
    });

    it("rejects a part count that is not a positive integer and returns undefined for an inverted interval", () => {
        expect(() =>
            divideInterval({
                interval: { start: new Date(0), end: new Date(10) },
                partCount: 0,
            }),
        ).toThrow(RangeError);
        expect(
            divideInterval({
                interval: { start: new Date(0), end: new Date(10) },
                partCount: 1.5,
            }),
        ).toBeUndefined();
        expect(
            divideInterval({
                interval: { start: new Date(0), end: new Date(10) },
                partCount: "2" as unknown as number,
            }),
        ).toBeUndefined();
        expect(
            divideInterval({
                interval: { start: new Date(10), end: new Date(0) },
                partCount: 2,
            }),
        ).toBeUndefined();
    });

    it("returns undefined for an invalid interval", () => {
        expect(
            divideInterval({
                interval: { start: new Date(Number.NaN), end: new Date(1) },
                partCount: 2,
            }),
        ).toBeUndefined();
    });
});
