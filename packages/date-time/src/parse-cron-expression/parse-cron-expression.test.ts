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
        expect(parseCronExpression({ expression: "@reboot" })).toBeUndefined();
        expect(isValidCronExpression({ expression: "@daily" })).toBe(true);
        expect(
            parseCronExpression({ expression: "0 9 * * 1-5" })?.hours,
        ).toEqual([9]);
        expect(
            parseCronExpression({
                expression: "0 9 * * 1-5",
                seconds: "required",
            }),
        ).toBeUndefined();
        expect(
            doesCronMatch({
                schedule: "0 9 * * *",
                date: "2026-11-26T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 9 * * 1-5",
                date: "2026-11-26T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 9 * * 1-5",
                date: "2026-11-28T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            (getNextCronRuns({
                schedule: "0 9 * * *",
                now: "2026-11-26T08:00:00Z",
                timeZone: "UTC",
            }) ?? [])[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            (getPreviousCronRuns({
                schedule: "0 9 * * *",
                now: "2026-11-26T10:00:00Z",
                timeZone: "UTC",
            }) ?? [])[0]?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(describeCronExpression({ schedule: "0 9 * * 1-5" })).toBe(
            "At 09:00 AM, Monday through Friday",
        );
        expect(() =>
            getNextCronRuns({ schedule: "* * * * *", count: 0 }),
        ).toThrow(RangeError);
    });
});
