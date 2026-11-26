import { describe, expect, it } from "vitest";
import { subtractIntervals } from "../index.js";

function iso(pieces: readonly { start: Date; end: Date }[]): string[][] {
    return pieces.map((piece) => [
        piece.start.toISOString(),
        piece.end.toISOString(),
    ]);
}

describe("subtractIntervals", () => {
    const source = { start: new Date(0), end: new Date(10) };

    it("returns the parts of the source that were not removed", () => {
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(2), end: new Date(4) },
                ]),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(2).toISOString()],
            [new Date(4).toISOString(), new Date(10).toISOString()],
        ]);
        expect(iso(subtractIntervals(source, []))).toEqual([
            [new Date(0).toISOString(), new Date(10).toISOString()],
        ]);
        expect(
            subtractIntervals(source, [
                { start: new Date(0), end: new Date(10) },
            ]),
        ).toEqual([]);
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(-20), end: new Date(-5) },
                ]),
            ),
        ).toEqual([[new Date(0).toISOString(), new Date(10).toISOString()]]);
    });

    it("trims overlaps, merges removed pieces, and splits on an empty cut", () => {
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(-5), end: new Date(3) },
                ]),
            ),
        ).toEqual([[new Date(3).toISOString(), new Date(10).toISOString()]]);
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(7), end: new Date(15) },
                ]),
            ),
        ).toEqual([[new Date(0).toISOString(), new Date(7).toISOString()]]);
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(8), end: new Date(9) },
                    { start: new Date(1), end: new Date(2) },
                ]),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(1).toISOString()],
            [new Date(2).toISOString(), new Date(8).toISOString()],
            [new Date(9).toISOString(), new Date(10).toISOString()],
        ]);
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(1), end: new Date(5) },
                    { start: new Date(3), end: new Date(6) },
                ]),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(1).toISOString()],
            [new Date(6).toISOString(), new Date(10).toISOString()],
        ]);
        expect(
            iso(
                subtractIntervals(source, [
                    { start: new Date(2), end: new Date(2) },
                ]),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(2).toISOString()],
            [new Date(2).toISOString(), new Date(10).toISOString()],
        ]);
        expect(
            subtractIntervals({ start: new Date(5), end: new Date(5) }, [
                { start: new Date(0), end: new Date(10) },
            ]),
        ).toEqual([]);
    });

    it("cuts calendar instants, including leap day and the year bounds", () => {
        expect(
            iso(
                subtractIntervals(
                    {
                        start: new Date("2024-02-28T00:00:00Z"),
                        end: new Date("2024-03-02T00:00:00Z"),
                    },
                    [
                        {
                            start: new Date("2024-02-29T00:00:00Z"),
                            end: new Date("2024-03-01T00:00:00Z"),
                        },
                    ],
                ),
            ),
        ).toEqual([
            ["2024-02-28T00:00:00.000Z", "2024-02-29T00:00:00.000Z"],
            ["2024-03-01T00:00:00.000Z", "2024-03-02T00:00:00.000Z"],
        ]);
        expect(
            iso(
                subtractIntervals(
                    {
                        start: new Date("0000-01-01T00:00:00Z"),
                        end: new Date("0000-01-03T00:00:00Z"),
                    },
                    [
                        {
                            start: new Date("0000-01-01T12:00:00Z"),
                            end: new Date("0000-01-02T00:00:00Z"),
                        },
                    ],
                ),
            ),
        ).toEqual([
            ["0000-01-01T00:00:00.000Z", "0000-01-01T12:00:00.000Z"],
            ["0000-01-02T00:00:00.000Z", "0000-01-03T00:00:00.000Z"],
        ]);
        expect(
            iso(
                subtractIntervals(
                    {
                        start: new Date("9999-12-30T00:00:00Z"),
                        end: new Date("9999-12-31T00:00:00Z"),
                    },
                    [
                        {
                            start: new Date("9999-12-30T12:00:00Z"),
                            end: new Date("9999-12-31T00:00:00Z"),
                        },
                    ],
                ),
            ),
        ).toEqual([["9999-12-30T00:00:00.000Z", "9999-12-30T12:00:00.000Z"]]);
    });

    it("throws when removed is not an array or an interval is invalid", () => {
        expect(() =>
            subtractIntervals(source, null as unknown as readonly never[]),
        ).toThrow(TypeError);
        expect(() =>
            subtractIntervals(source, {
                start: new Date(0),
                end: new Date(1),
            } as unknown as readonly never[]),
        ).toThrow(TypeError);
        expect(() =>
            subtractIntervals(
                {
                    start: new Date(10),
                    end: new Date(0),
                },
                [],
            ),
        ).toThrow(RangeError);
        expect(() =>
            subtractIntervals(source, [
                { start: new Date(4), end: new Date(2) },
            ]),
        ).toThrow(RangeError);
        expect(() =>
            subtractIntervals(
                {
                    start: new Date("not-a-date"),
                    end: new Date(1),
                },
                [],
            ),
        ).toThrow(RangeError);
    });
});
