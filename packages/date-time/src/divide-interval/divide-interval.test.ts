import { describe, expect, it } from "vitest";
import { divideInterval } from "../index.js";

describe("divideInterval", () => {
    it("splits ten milliseconds into two equal parts", () => {
        expect(
            divideInterval({ start: new Date(0), end: new Date(10) }, 2).map(
                (part) => [part.start.getTime(), part.end.getTime()],
            ),
        ).toEqual([
            [0, 5],
            [5, 10],
        ]);
    });

    it("gives the extra milliseconds to the earlier parts and splits a leap day in half", () => {
        expect(
            divideInterval({ start: new Date(0), end: new Date(10) }, 3).map(
                (part) => [part.start.getTime(), part.end.getTime()],
            ),
        ).toEqual([
            [0, 4],
            [4, 7],
            [7, 10],
        ]);
        const leapDay = divideInterval(
            {
                start: new Date("2024-02-29T00:00:00Z"),
                end: new Date("2024-03-01T00:00:00Z"),
            },
            2,
        );
        expect(leapDay.map((part) => part.end.toISOString())).toEqual([
            "2024-02-29T12:00:00.000Z",
            "2024-03-01T00:00:00.000Z",
        ]);
        const yearBoundary = divideInterval(
            {
                start: new Date("2024-12-31T00:00:00Z"),
                end: new Date("2025-01-01T00:00:00Z"),
            },
            1,
        );
        expect(yearBoundary[0]?.start.toISOString()).toBe(
            "2024-12-31T00:00:00.000Z",
        );
        expect(yearBoundary[0]?.end.toISOString()).toBe(
            "2025-01-01T00:00:00.000Z",
        );
        const empty = divideInterval(
            { start: new Date(5), end: new Date(5) },
            2,
        );
        expect(empty.map((part) => part.start.getTime())).toEqual([5, 5]);
        expect(
            empty.every((part) => part.start.getTime() === part.end.getTime()),
        ).toBe(true);
    });

    it("rejects a part count that is not a positive integer and an inverted interval", () => {
        expect(() =>
            divideInterval({ start: new Date(0), end: new Date(10) }, 0),
        ).toThrow(RangeError);
        expect(() =>
            divideInterval({ start: new Date(0), end: new Date(10) }, 0),
        ).toThrow("`partCount` must be a positive integer; received 0.");
        expect(() =>
            divideInterval({ start: new Date(0), end: new Date(10) }, 1.5),
        ).toThrow("`partCount` must be an integer; received 1.5.");
        expect(() =>
            divideInterval(
                { start: new Date(0), end: new Date(10) },
                "2" as unknown as number,
            ),
        ).toThrow(TypeError);
        expect(() =>
            divideInterval({ start: new Date(10), end: new Date(0) }, 2),
        ).toThrow(RangeError);
    });
});
