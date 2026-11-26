import { describe, expect, it } from "vitest";
import { getPreviousCronRuns } from "../cron.js";
import { getLocalTimeZone } from "../index.js";

describe("getPreviousCronRuns", () => {
    it("returns the 09:00 run earlier the same day", () => {
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                timeZone: "UTC",
            })[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
    });

    it("excludes a run at now or at startDate and skips the weekend", () => {
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T09:00:00.000Z",
                timeZone: "UTC",
            })[0]?.toISOString(),
        ).toBe("2026-11-25T09:00:00.000Z");
        expect(
            getPreviousCronRuns("0 9 * * 1-5", {
                now: "2026-11-30T08:00:00Z",
                timeZone: "UTC",
            })[0]?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                timeZone: "UTC",
                count: 2,
            }).map((run) => run.toISOString()),
        ).toEqual(["2026-11-26T09:00:00.000Z", "2026-11-25T09:00:00.000Z"]);
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                timeZone: "UTC",
                startDate: "2026-11-26T09:00:00.000Z",
            }),
        ).toEqual([]);
        expect(
            getPreviousCronRuns("not a cron", { now: "2026-11-26T10:00:00Z" }),
        ).toEqual([]);
        expect(
            getPreviousCronRuns("@reboot", { now: "2026-11-26T10:00:00Z" }),
        ).toEqual([]);
    });

    it("rejects a count outside 1 through 1000", () => {
        expect(() =>
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                count: 0,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                count: 0,
            }),
        ).toThrow("`count`");
        expect(() =>
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                count: 1001,
            }),
        ).toThrow("`count`");
        expect(() =>
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                count: "1",
            }),
        ).toThrow(TypeError);
        expect(() =>
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                count: "1",
            }),
        ).toThrow("`count`");
    });

    it("defaults count to 1 and timeZone to the system zone", () => {
        const now = "2026-11-26T10:00:00Z";
        expect(
            getPreviousCronRuns("0 9 * * *", { now }).map((run) =>
                run.toISOString(),
            ),
        ).toEqual(
            getPreviousCronRuns("0 9 * * *", {
                now,
                count: 1,
                timeZone: getLocalTimeZone(),
            }).map((run) => run.toISOString()),
        );
    });

    it("reads 09:00 in New York as 13:00 UTC in July and skips the missing 02:00", () => {
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-07-15T14:00:00Z",
                timeZone: "America/New_York",
            })[0]?.toISOString(),
        ).toBe("2026-07-15T13:00:00.000Z");
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-01-15T15:00:00Z",
                timeZone: "America/New_York",
            })[0]?.toISOString(),
        ).toBe("2026-01-15T14:00:00.000Z");
        expect(
            getPreviousCronRuns("0 2 * * *", {
                now: "2024-03-10T12:00:00Z",
                timeZone: "America/New_York",
            })[0]?.toISOString(),
        ).toBe("2024-03-09T07:00:00.000Z");
    });
});
