import { describe, expect, it } from "vitest";
import { listBusinessDaysInInterval } from "../index.js";

function iso(dates: readonly Date[]): string[] {
    return dates.map((date) => date.toISOString());
}

describe("listBusinessDaysInInterval", () => {
    it("lists weekday starts and skips the default weekend", () => {
        const utc = { timeZone: "UTC" };

        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("2026-11-27T00:00:00Z"),
                        end: new Date("2026-11-30T00:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["2026-11-27T00:00:00.000Z"]);
        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("2026-11-27T15:00:00Z"),
                        end: new Date("2026-11-28T01:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["2026-11-27T00:00:00.000Z"]);
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-28T00:00:00Z"),
                    end: new Date("2026-11-30T00:00:00Z"),
                },
                utc,
            ),
        ).toEqual([]);
        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("2026-11-26T00:00:00Z"),
                        end: new Date("2026-12-01T00:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual([
            "2026-11-26T00:00:00.000Z",
            "2026-11-27T00:00:00.000Z",
            "2026-11-30T00:00:00.000Z",
        ]);
    });

    it("includes leap day and the year bounds when they are business days", () => {
        const utc = { timeZone: "UTC" };

        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("2024-02-29T00:00:00Z"),
                        end: new Date("2024-03-02T00:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["2024-02-29T00:00:00.000Z", "2024-03-01T00:00:00.000Z"]);
        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("2023-02-28T00:00:00Z"),
                        end: new Date("2023-03-02T00:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["2023-02-28T00:00:00.000Z", "2023-03-01T00:00:00.000Z"]);
        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("0000-01-01T00:00:00Z"),
                        end: new Date("0000-01-04T00:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["0000-01-03T00:00:00.000Z"]);
        expect(
            iso(
                listBusinessDaysInInterval(
                    {
                        start: new Date("9999-12-31T00:00:00Z"),
                        end: new Date("9999-12-31T12:00:00Z"),
                    },
                    utc,
                ),
            ),
        ).toEqual(["9999-12-31T00:00:00.000Z"]);
    });

    it("returns nothing for an empty midnight interval and keeps a noon point", () => {
        const utc = { timeZone: "UTC" };
        const noon = new Date("2026-11-26T12:00:00Z");

        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-26T00:00:00Z"),
                    end: new Date("2026-11-26T00:00:00Z"),
                },
                utc,
            ),
        ).toEqual([]);
        expect(
            iso(listBusinessDaysInInterval({ start: noon, end: noon }, utc)),
        ).toEqual(["2026-11-26T00:00:00.000Z"]);
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-28T12:00:00Z"),
                    end: new Date("2026-11-28T12:00:00Z"),
                },
                utc,
            ),
        ).toEqual([]);
    });

    it("drops holidays and can treat Saturday as a business day", () => {
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-26T00:00:00Z"),
                    end: new Date("2026-11-28T00:00:00Z"),
                },
                { timeZone: "UTC", holidays: ["2026-11-26"] },
            ).map((date) => date.toISOString()),
        ).toEqual(["2026-11-27T00:00:00.000Z"]);
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-27T00:00:00Z"),
                    end: new Date("2026-11-30T00:00:00Z"),
                },
                { timeZone: "UTC", weekendDays: [7, 1] },
            ).map((date) => date.toISOString()),
        ).toEqual(["2026-11-27T00:00:00.000Z", "2026-11-28T00:00:00.000Z"]);
    });

    it("uses local midnights across daylight saving", () => {
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2024-03-08T05:00:00Z"),
                    end: new Date("2024-03-12T04:00:00Z"),
                },
                { timeZone: "America/New_York" },
            ).map((date) => date.toISOString()),
        ).toEqual(["2024-03-08T05:00:00.000Z", "2024-03-11T04:00:00.000Z"]);
        expect(
            listBusinessDaysInInterval(
                {
                    start: new Date("2024-09-06T04:00:00Z"),
                    end: new Date("2024-09-10T03:00:00Z"),
                },
                { timeZone: "America/Santiago" },
            ).map((date) => date.toISOString()),
        ).toEqual(["2024-09-06T04:00:00.000Z", "2024-09-09T04:00:00.000Z"]);
    });

    it("throws when the interval or the time zone is invalid", () => {
        expect(() =>
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-28T00:00:00Z"),
                    end: new Date("2026-11-27T00:00:00Z"),
                },
                { timeZone: "UTC" },
            ),
        ).toThrow(RangeError);
        expect(() =>
            listBusinessDaysInInterval(
                null as unknown as { start: Date; end: Date },
            ),
        ).toThrow(TypeError);
        expect(() =>
            listBusinessDaysInInterval(
                {
                    start: new Date("2026-11-26T00:00:00Z"),
                    end: new Date("2026-11-27T00:00:00Z"),
                },
                { timeZone: "Mars/Base" },
            ),
        ).toThrow(RangeError);
    });
});
