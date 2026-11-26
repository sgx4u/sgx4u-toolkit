import { describe, expect, it } from "vitest";
import { getNextCronRuns, parseCronExpression } from "../cron.js";

describe("getNextCronRuns", () => {
    it("returns the next run and includes an instant that matches now", () => {
        expect(
            (
                getNextCronRuns({
                    schedule: "0 9 * * *",
                    now: "2026-11-26T08:00:00Z",
                    timeZone: "UTC",
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual(["2026-11-26T09:00:00.000Z"]);
        const parsed = parseCronExpression({ expression: "0 9 * * 1" });
        expect(parsed).toBeDefined();
        if (parsed !== undefined) {
            expect(
                (
                    getNextCronRuns({
                        schedule: parsed,
                        now: "2026-11-26T08:00:00Z",
                        timeZone: "UTC",
                    }) ?? []
                ).map((date) => date.toISOString()),
            ).toEqual(["2026-11-30T09:00:00.000Z"]);
        }
        expect(
            (getNextCronRuns({
                schedule: "0 9 * * *",
                now: "2026-11-26T09:00:00Z",
                timeZone: "UTC",
            }) ?? [])[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
    });

    it("rolls across New Year, stops before endDate, and finds a leap day", () => {
        expect(
            (
                getNextCronRuns({
                    schedule: "0 0 * * *",
                    now: "2026-12-30T12:00:00Z",
                    timeZone: "UTC",
                    count: 3,
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual([
            "2026-12-31T00:00:00.000Z",
            "2027-01-01T00:00:00.000Z",
            "2027-01-02T00:00:00.000Z",
        ]);
        expect(
            (
                getNextCronRuns({
                    schedule: "0 9 * * *",
                    now: "2026-11-26T08:00:00Z",
                    timeZone: "UTC",
                    count: 5,
                    endDate: "2026-11-28T09:00:00Z",
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual(["2026-11-26T09:00:00.000Z", "2026-11-27T09:00:00.000Z"]);
        expect(
            (
                getNextCronRuns({
                    schedule: "0 0 29 2 *",
                    now: "2024-02-28T12:00:00Z",
                    timeZone: "UTC",
                    count: 2,
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual(["2024-02-29T00:00:00.000Z"]);
    });

    it("skips a missing 02:00 and runs a repeated 01:30 only once", () => {
        expect(
            (
                getNextCronRuns({
                    schedule: "0 2 * * *",
                    now: "2026-03-07T12:00:00Z",
                    timeZone: "America/New_York",
                    count: 3,
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual([
            "2026-03-09T06:00:00.000Z",
            "2026-03-10T06:00:00.000Z",
            "2026-03-11T06:00:00.000Z",
        ]);
        expect(
            (
                getNextCronRuns({
                    schedule: "30 1 * * *",
                    now: "2026-10-31T12:00:00Z",
                    timeZone: "America/New_York",
                    count: 3,
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual([
            "2026-11-01T05:30:00.000Z",
            "2026-11-02T06:30:00.000Z",
            "2026-11-03T06:30:00.000Z",
        ]);
        expect(
            (
                getNextCronRuns({
                    schedule: "0 9 * * *",
                    now: "2026-11-26T03:00:00Z",
                    timeZone: "Asia/Kolkata",
                }) ?? []
            ).map((date) => date.toISOString()),
        ).toEqual(["2026-11-26T03:30:00.000Z"]);
    });

    it("returns an empty list for an unparsed expression and rejects a bad count", () => {
        expect(
            getNextCronRuns({
                schedule: "not cron",
                now: "2026-11-26T08:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual([]);
        expect(() =>
            getNextCronRuns({
                schedule: "* * * * *",
                count: 0,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextCronRuns({
                schedule: "* * * * *",
                count: 0,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow("`count` must be an integer from 1 to 1000");
        expect(() =>
            getNextCronRuns({
                schedule: "* * * * *",
                count: 1001,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextCronRuns({
                schedule: "* * * * *",
                count: 1001,
                now: "2026-01-01T00:00:00Z",
            }),
        ).toThrow("received 1001");
    });
});
