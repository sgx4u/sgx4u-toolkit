import { describe, expect, it } from "vitest";
import {
    describeCronExpression,
    doesCronMatch,
    getNextCronRuns,
    getPreviousCronRuns,
    isValidCronExpression,
    parseCronExpression,
} from "../cron.js";

describe("cron", () => {
    it("parses a weekday schedule and finds the next and previous run", () => {
        expect(parseCronExpression("@reboot")).toBeUndefined();
        expect(isValidCronExpression("@daily")).toBe(true);
        expect(parseCronExpression("0 9 * * 1-5")?.hours).toEqual([9]);
        expect(
            parseCronExpression("0 9 * * 1-5", { seconds: "required" }),
        ).toBeUndefined();
        expect(
            doesCronMatch("0 9 * * *", "2026-11-26T09:00:00Z", {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch("0 9 * * 1-5", "2026-11-26T09:00:00Z", {
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch("0 9 * * 1-5", "2026-11-28T09:00:00Z", {
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            getNextCronRuns("0 9 * * *", {
                now: "2026-11-26T08:00:00Z",
                timeZone: "UTC",
            })[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getPreviousCronRuns("0 9 * * *", {
                now: "2026-11-26T10:00:00Z",
                timeZone: "UTC",
            })[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(describeCronExpression("0 9 * * 1-5")).toBe(
            "At 09:00 AM, Monday through Friday",
        );
        expect(() => getNextCronRuns("* * * * *", { count: 0 })).toThrow(
            RangeError,
        );
    });
});
