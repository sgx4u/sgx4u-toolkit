import { describe, expect, it } from "vitest";
import { splitInterval } from "../index.js";

function iso(pieces: readonly { start: Date; end: Date }[]): string[][] {
    return pieces.map((piece) => [
        piece.start.toISOString(),
        piece.end.toISOString(),
    ]);
}

describe("splitInterval", () => {
    it("splits evenly and shortens the last piece", () => {
        expect(
            iso(
                splitInterval(
                    { start: new Date(0), end: new Date(10) },
                    { milliseconds: 4 },
                ),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(4).toISOString()],
            [new Date(4).toISOString(), new Date(8).toISOString()],
            [new Date(8).toISOString(), new Date(10).toISOString()],
        ]);
        expect(
            iso(
                splitInterval(
                    { start: new Date(0), end: new Date(8) },
                    { milliseconds: 4 },
                ),
            ),
        ).toEqual([
            [new Date(0).toISOString(), new Date(4).toISOString()],
            [new Date(4).toISOString(), new Date(8).toISOString()],
        ]);
        expect(
            splitInterval(
                { start: new Date(0), end: new Date(0) },
                { milliseconds: 4 },
            ),
        ).toEqual([]);
    });

    it("steps calendar months across leap day and month end", () => {
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("2024-01-31T00:00:00Z"),
                        end: new Date("2024-05-01T00:00:00Z"),
                    },
                    { months: 1 },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            ["2024-01-31T00:00:00.000Z", "2024-02-29T00:00:00.000Z"],
            ["2024-02-29T00:00:00.000Z", "2024-03-29T00:00:00.000Z"],
            ["2024-03-29T00:00:00.000Z", "2024-04-29T00:00:00.000Z"],
            ["2024-04-29T00:00:00.000Z", "2024-05-01T00:00:00.000Z"],
        ]);
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("2026-01-31T00:00:00Z"),
                        end: new Date("2026-03-15T00:00:00Z"),
                    },
                    { months: 1 },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            ["2026-01-31T00:00:00.000Z", "2026-02-28T00:00:00.000Z"],
            ["2026-02-28T00:00:00.000Z", "2026-03-15T00:00:00.000Z"],
        ]);
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("0000-02-28T00:00:00Z"),
                        end: new Date("0000-03-02T00:00:00Z"),
                    },
                    { days: 1 },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            ["0000-02-28T00:00:00.000Z", "0000-02-29T00:00:00.000Z"],
            ["0000-02-29T00:00:00.000Z", "0000-03-01T00:00:00.000Z"],
            ["0000-03-01T00:00:00.000Z", "0000-03-02T00:00:00.000Z"],
        ]);
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("9999-12-30T00:00:00Z"),
                        end: new Date("9999-12-31T12:00:00Z"),
                    },
                    { days: 1 },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            ["9999-12-30T00:00:00.000Z", "9999-12-31T00:00:00.000Z"],
            ["9999-12-31T00:00:00.000Z", "9999-12-31T12:00:00.000Z"],
        ]);
    });

    it("keeps a local day across the New York spring-forward", () => {
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("2024-03-09T14:00:00Z"),
                        end: new Date("2024-03-11T13:00:00Z"),
                    },
                    { days: 1 },
                    { timeZone: "America/New_York" },
                ),
            ),
        ).toEqual([
            ["2024-03-09T14:00:00.000Z", "2024-03-10T13:00:00.000Z"],
            ["2024-03-10T13:00:00.000Z", "2024-03-11T13:00:00.000Z"],
        ]);
        expect(
            iso(
                splitInterval(
                    {
                        start: new Date("2024-09-07T04:00:00Z"),
                        end: new Date("2024-09-09T05:00:00Z"),
                    },
                    { days: 1 },
                    { timeZone: "America/Santiago" },
                ),
            ),
        ).toEqual([
            ["2024-09-07T04:00:00.000Z", "2024-09-08T04:00:00.000Z"],
            ["2024-09-08T04:00:00.000Z", "2024-09-09T04:00:00.000Z"],
            ["2024-09-09T04:00:00.000Z", "2024-09-09T05:00:00.000Z"],
        ]);
    });

    it("throws when the step is not positive or the result is too long", () => {
        const interval = { start: new Date(0), end: new Date(10) };

        expect(() => splitInterval(interval, { milliseconds: 0 })).toThrow(
            RangeError,
        );
        expect(() => splitInterval(interval, { hours: -1 })).toThrow(
            RangeError,
        );
        expect(() => splitInterval(interval, { days: -1 })).toThrow(RangeError);
        expect(() => splitInterval(interval, {})).toThrow(RangeError);
        expect(() =>
            splitInterval(
                { start: new Date(0), end: new Date(100_001) },
                { milliseconds: 1 },
            ),
        ).toThrow(RangeError);
        expect(() =>
            splitInterval(
                {
                    start: new Date("2026-01-02T00:00:00Z"),
                    end: new Date("2026-01-01T00:00:00Z"),
                },
                { days: 1 },
            ),
        ).toThrow(RangeError);
        expect(() =>
            splitInterval(
                {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2026-01-03T00:00:00Z"),
                },
                { days: 1 },
                { timeZone: "Mars/Base" },
            ),
        ).toThrow(RangeError);
    });
});
