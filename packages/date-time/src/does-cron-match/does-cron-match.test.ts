import { describe, expect, it } from "vitest";
import { doesCronMatch, parseCronExpression } from "../cron.js";

describe("doesCronMatch", () => {
    it("matches a daily minute and either a restricted day of month or weekday", () => {
        expect(
            doesCronMatch({
                schedule: "0 9 * * *",
                date: "2026-11-26T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 9 * * *",
                date: "2026-11-26T09:01:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            doesCronMatch({
                schedule: "0 0 1 * 1",
                date: "2026-11-02T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 0 1 * 1",
                date: "2026-11-03T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        const parsed = parseCronExpression({ expression: "0 9 * * *" });
        expect(parsed).toBeDefined();
        if (parsed !== undefined) {
            expect(
                doesCronMatch({
                    schedule: parsed,
                    date: "2026-11-26T09:00:00Z",
                    timeZone: "UTC",
                }),
            ).toBe(true);
        }
    });

    it("matches leap day and New Year's midnight, and not the day before", () => {
        expect(
            doesCronMatch({
                schedule: "0 0 29 2 *",
                date: "2024-02-29T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 0 29 2 *",
                date: "2023-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            doesCronMatch({
                schedule: "0 0 1 1 *",
                date: "2025-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "0 0 1 1 *",
                date: "2024-12-31T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
    });

    it("matches both fall-back 01:30 instants and skips the missing 02:30", () => {
        const zone = { timeZone: "America/New_York" };
        expect(
            doesCronMatch({
                schedule: "30 1 * * *",
                date: "2024-11-03T05:30:00Z",
                ...zone,
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "30 1 * * *",
                date: "2024-11-03T06:30:00Z",
                ...zone,
            }),
        ).toBe(true);
        expect(
            doesCronMatch({
                schedule: "30 2 * * *",
                date: "2024-03-10T07:30:00Z",
                ...zone,
            }),
        ).toBe(false);
        expect(
            doesCronMatch({
                schedule: "30 3 * * *",
                date: "2024-03-10T07:30:00Z",
                ...zone,
            }),
        ).toBe(true);
    });

    it("returns false for an expression that does not parse and throws for a date that does not", () => {
        expect(
            doesCronMatch({
                schedule: "not a cron",
                date: "2026-11-26T09:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            doesCronMatch({
                schedule: "0 9 * * *",
                date: "nope",
                timeZone: "UTC",
            }),
        ).toBe(false);
    });
});
