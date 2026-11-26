import { describe, expect, it } from "vitest";
import { listDatesInInterval } from "../index.js";

function iso(dates: readonly Date[]): string[] {
    return dates.map((date) => date.toISOString());
}

describe("listDatesInInterval", () => {
    it("steps one day by default and excludes the end", () => {
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2026-01-01T00:00:00Z"),
                        end: new Date("2026-01-03T00:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual(["2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z"]);
        expect(
            listDatesInInterval(
                {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2026-01-01T00:00:00Z"),
                },
                { timeZone: "UTC" },
            ),
        ).toEqual([]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2026-01-31T00:00:00Z"),
                        end: new Date("2026-02-02T00:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual(["2026-01-31T00:00:00.000Z", "2026-02-01T00:00:00.000Z"]);
    });

    it("includes leap day and the year bounds", () => {
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2024-02-28T00:00:00Z"),
                        end: new Date("2024-03-02T00:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            "2024-02-28T00:00:00.000Z",
            "2024-02-29T00:00:00.000Z",
            "2024-03-01T00:00:00.000Z",
        ]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2023-02-27T00:00:00Z"),
                        end: new Date("2023-03-01T00:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual(["2023-02-27T00:00:00.000Z", "2023-02-28T00:00:00.000Z"]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("0000-02-28T00:00:00Z"),
                        end: new Date("0000-03-02T00:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            "0000-02-28T00:00:00.000Z",
            "0000-02-29T00:00:00.000Z",
            "0000-03-01T00:00:00.000Z",
        ]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("9999-12-30T00:00:00Z"),
                        end: new Date("9999-12-31T12:00:00Z"),
                    },
                    { timeZone: "UTC" },
                ),
            ),
        ).toEqual(["9999-12-30T00:00:00.000Z", "9999-12-31T00:00:00.000Z"]);
    });

    it("clamps a month step and aligns to a unit", () => {
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2024-01-31T00:00:00Z"),
                        end: new Date("2024-04-30T00:00:00Z"),
                    },
                    { step: { months: 1 }, timeZone: "UTC" },
                ),
            ),
        ).toEqual([
            "2024-01-31T00:00:00.000Z",
            "2024-02-29T00:00:00.000Z",
            "2024-03-29T00:00:00.000Z",
            "2024-04-29T00:00:00.000Z",
        ]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2026-01-01T00:30:00Z"),
                        end: new Date("2026-01-01T03:00:00Z"),
                    },
                    {
                        alignToUnit: "hour",
                        step: { hours: 1 },
                        timeZone: "UTC",
                    },
                ),
            ),
        ).toEqual(["2026-01-01T01:00:00.000Z", "2026-01-01T02:00:00.000Z"]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2026-11-26T00:00:00Z"),
                        end: new Date("2026-12-14T00:00:00Z"),
                    },
                    {
                        alignToUnit: "week",
                        weekStartsOn: 1,
                        step: { weeks: 1 },
                        timeZone: "UTC",
                    },
                ),
            ),
        ).toEqual(["2026-11-30T00:00:00.000Z", "2026-12-07T00:00:00.000Z"]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2026-11-26T00:00:00Z"),
                        end: new Date("2026-12-14T00:00:00Z"),
                    },
                    {
                        alignToUnit: "week",
                        weekStartsOn: 7,
                        step: { weeks: 1 },
                        timeZone: "UTC",
                    },
                ),
            ),
        ).toEqual([
            "2026-11-29T00:00:00.000Z",
            "2026-12-06T00:00:00.000Z",
            "2026-12-13T00:00:00.000Z",
        ]);
    });

    it("keeps local days across a 23-hour day and a skipped midnight", () => {
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2024-03-09T14:00:00Z"),
                        end: new Date("2024-03-11T13:00:00Z"),
                    },
                    { timeZone: "America/New_York" },
                ),
            ),
        ).toEqual(["2024-03-09T14:00:00.000Z", "2024-03-10T13:00:00.000Z"]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2024-09-07T04:00:00Z"),
                        end: new Date("2024-09-10T03:00:00Z"),
                    },
                    { timeZone: "America/Santiago" },
                ),
            ),
        ).toEqual([
            "2024-09-07T04:00:00.000Z",
            "2024-09-08T04:00:00.000Z",
            "2024-09-09T04:00:00.000Z",
        ]);
        expect(
            iso(
                listDatesInInterval(
                    {
                        start: new Date("2024-03-10T05:00:00Z"),
                        end: new Date("2024-03-10T08:00:00Z"),
                    },
                    { step: { hours: 1 }, timeZone: "America/New_York" },
                ),
            ),
        ).toEqual([
            "2024-03-10T05:00:00.000Z",
            "2024-03-10T06:00:00.000Z",
            "2024-03-10T07:00:00.000Z",
        ]);
    });

    it("throws when the step does not move forward or the result is too long", () => {
        const interval = {
            start: new Date(0),
            end: new Date(10),
        };

        expect(() =>
            listDatesInInterval(interval, {
                step: { days: 0 },
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            listDatesInInterval(interval, {
                step: { hours: -1 },
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            listDatesInInterval(
                { start: new Date(0), end: new Date(100_001) },
                { step: { milliseconds: 1 }, timeZone: "UTC" },
            ),
        ).toThrow(RangeError);
        expect(() =>
            listDatesInInterval(
                {
                    start: new Date("2026-01-02T00:00:00Z"),
                    end: new Date("2026-01-01T00:00:00Z"),
                },
                { timeZone: "UTC" },
            ),
        ).toThrow(RangeError);
        expect(() =>
            listDatesInInterval(
                {
                    start: new Date("2026-01-01T00:00:00Z"),
                    end: new Date("2026-01-02T00:00:00Z"),
                },
                { timeZone: "Mars/Base" },
            ),
        ).toThrow(RangeError);
    });
});
